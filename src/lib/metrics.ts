import type {
  DatasetMetrics,
  DistrictSlice,
  ListingRecord,
  MonthlyPoint,
  PriceBand,
  ProductSlice,
} from '@/types/data'

const priceStops = [10000, 20000, 30000, 50000]

function priceBandFor(value?: number): string {
  if (value === undefined || Number.isNaN(value)) return '未填价格'
  if (value < priceStops[0]) return `< ${priceStops[0]}`
  for (let i = 0; i < priceStops.length - 1; i += 1) {
    const start = priceStops[i]
    const end = priceStops[i + 1]
    if (value >= start && value < end) {
      return `${start} - ${end}`
    }
  }
  return `≥ ${priceStops[priceStops.length - 1]}`
}

function buildPriceBands(records: ListingRecord[]): PriceBand[] {
  const buckets = new Map<string, number>()
  records.forEach((record) => {
    const band = priceBandFor(record.avgPrice)
    buckets.set(band, (buckets.get(band) || 0) + 1)
  })
  return Array.from(buckets.entries())
    .map(([band, count]) => ({ band, count }))
    .sort((a, b) => (a.band > b.band ? 1 : -1))
}

function buildMonthly(records: ListingRecord[]): MonthlyPoint[] {
  const monthly = new Map<string, { units: number; revenue: number; priceSum: number; priceCount: number }>()

  records.forEach((record) => {
    const entry = monthly.get(record.month) || { units: 0, revenue: 0, priceSum: 0, priceCount: 0 }
    entry.units += record.unitsSold || 0
    entry.revenue += record.revenue || 0

    if (typeof record.avgPrice === 'number') {
      entry.priceSum += record.avgPrice
      entry.priceCount += 1
    }

    monthly.set(record.month, entry)
  })

  return Array.from(monthly.entries())
    .map(
      ([month, value]): MonthlyPoint => ({
        month,
        units: value.units,
        revenue: value.revenue,
        avgPrice: value.priceCount > 0 ? value.priceSum / value.priceCount : 0,
      }),
    )
    .sort((a, b) => a.month.localeCompare(b.month))
}

function buildSlices(records: ListingRecord[], key: 'district' | 'productType') {
  const map = new Map<string, { units: number; revenue: number }>()
  records.forEach((record) => {
    const name = record[key] || '未标注'
    const aggregate = map.get(name) || { units: 0, revenue: 0 }
    aggregate.units += record.unitsSold || 0
    aggregate.revenue += record.revenue || 0
    map.set(name, aggregate)
  })

  const items = Array.from(map.entries()).map(([name, { units, revenue }]) => ({
    name,
    units,
    revenue,
  }))

  return items.sort((a, b) => b.revenue - a.revenue)
}

export function buildMetrics(records: ListingRecord[]): DatasetMetrics {
  const monthly = buildMonthly(records)
  const districts: DistrictSlice[] = buildSlices(records, 'district')
  const productTypes: ProductSlice[] = buildSlices(records, 'productType')

  const totalRevenue = records.reduce((sum, r) => sum + (r.revenue || 0), 0)
  const totalUnits = records.reduce((sum, r) => sum + (r.unitsSold || 0), 0)

  const priceValues = records.map((r) => r.avgPrice).filter((n): n is number => typeof n === 'number')
  const avgPrice =
    priceValues.length > 0
      ? priceValues.reduce((sum, n) => sum + n, 0) / priceValues.length
      : 0

  const priceBands = buildPriceBands(records)

  return {
    totalUnits,
    totalRevenue,
    avgPrice: Number(avgPrice.toFixed(2)),
    months: monthly.map((m) => m.month),
    monthly,
    districts,
    productTypes,
    priceBands,
  }
}
