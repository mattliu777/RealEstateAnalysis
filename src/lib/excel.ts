import { randomUUID } from 'crypto'
import * as XLSX from 'xlsx'
import type { Dataset, ListingRecord, SheetSummary } from '@/types/data'

type HeaderMatch = {
  keys: string[]
  field: keyof Omit<ListingRecord, 'id' | 'month' | 'revenue'>
}

const headerMappings: HeaderMatch[] = [
  { field: 'project', keys: ['项目', '楼盘', '案名', '小区', '项目名称', 'project', 'estate'] },
  { field: 'city', keys: ['城市', 'city'] },
  { field: 'district', keys: ['区域', '区县', '板块', '商圈', 'district', '区域名称'] },
  { field: 'productType', keys: ['产品', '业态', '类型', '户型', '产品类型', 'product', 'type'] },
  {
    field: 'avgPrice',
    keys: ['价格', '均价', '平均价格', '单价', '售价', '均价(元/㎡)', 'price', 'avg price'],
  },
  { field: 'unitsSold', keys: ['套数', '销量', '成交套数', '去化套数', '数量', 'units', '套'] },
  { field: 'area', keys: ['面积', '建面', '成交面积', '体量', '面积(㎡)', 'area', '平方米'] },
]

function normalizeMonth(input: unknown, sheetName: string, fallbackIndex: number): string {
  const fromSheet = parseMonthFromSheetName(sheetName)
  if (fromSheet) return fromSheet

  if (typeof input === 'number' && input > 30000) {
    const parsed = XLSX.SSF.parse_date_code(input)
    if (parsed?.y && parsed?.m) {
      return `${parsed.y}-${String(parsed.m).padStart(2, '0')}`
    }
  }

  if (typeof input === 'string') {
    const cleaned = input.trim()
    const match = cleaned.match(/(20\d{2})[.\-/年]?(\d{1,2})/)
    if (match) {
      return `${match[1]}-${match[2].padStart(2, '0')}`
    }
  }

  return `未标注-${fallbackIndex + 1}`
}

function parseMonthFromSheetName(name: string): string | null {
  const normalized = name.replace(/\s+/g, '')
  const match = normalized.match(/(20\d{2})[.\-/年]?(\d{1,2})/)
  if (match) {
    return `${match[1]}-${match[2].padStart(2, '0')}`
  }
  return null
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'number' && Number.isFinite(value)) return value

  const str = String(value).trim()
  if (!str) return undefined

  const wanMatch = str.match(/([\d.]+)\s*万/)
  const cleaned = str.replace(/[^\d.-]/g, '')
  const num = Number.parseFloat(cleaned)
  if (Number.isNaN(num)) return undefined
  return wanMatch ? num * 10000 : num
}

function pickValue(row: Record<string, unknown>, aliases: string[]) {
  const lowerAliases = aliases.map((key) => key.toLowerCase())
  for (const [rawKey, rawValue] of Object.entries(row)) {
    const lowerKey = rawKey.toLowerCase()
    if (lowerAliases.some((alias) => lowerKey.includes(alias))) {
      return rawValue
    }
  }
  return undefined
}

function normalizeRow(
  row: Record<string, unknown>,
  month: string,
  sheetName: string,
  rowIndex: number,
): ListingRecord | null {
  const base: Partial<ListingRecord> = { month }

  for (const { field, keys } of headerMappings) {
    const value = pickValue(row, keys)
    if (value === undefined || value === null) continue

    if (field === 'avgPrice' || field === 'unitsSold' || field === 'area') {
      const numeric = toNumber(value)
      if (numeric !== undefined) {
        base[field] = numeric
      }
    } else {
      const text = String(value).trim()
      if (text) {
        base[field] = text
      }
    }
  }

  // Allow month column inside the sheet to override derived month
  const monthOverride = pickValue(row, ['月份', '月度', '日期', 'month'])
  if (monthOverride) {
    base.month = normalizeMonth(monthOverride, sheetName, rowIndex)
  }

  const hasContent =
    base.project || base.district || base.avgPrice !== undefined || base.unitsSold !== undefined
  if (!hasContent) {
    return null
  }

  const revenue =
    typeof base.unitsSold === 'number' && typeof base.avgPrice === 'number'
      ? base.unitsSold * base.avgPrice
      : undefined

  return {
    id: randomUUID(),
    month: base.month || month,
    city: base.city,
    district: base.district,
    project: base.project,
    productType: base.productType,
    avgPrice: base.avgPrice,
    unitsSold: base.unitsSold,
    area: base.area,
    revenue,
  }
}

export function parseWorkbook(buffer: Buffer): Dataset {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const records: ListingRecord[] = []
  const sheets: SheetSummary[] = []

  workbook.SheetNames.forEach((sheetName, sheetIndex) => {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) return

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null })
    const monthGuess = normalizeMonth(null, sheetName, sheetIndex)
    sheets.push({ name: sheetName, month: monthGuess, rows: rows.length })

    rows.forEach((row, rowIndex) => {
      const normalized = normalizeRow(row, monthGuess, sheetName, rowIndex)
      if (normalized) {
        records.push(normalized)
      }
    })
  })

  return { records, sheets }
}
