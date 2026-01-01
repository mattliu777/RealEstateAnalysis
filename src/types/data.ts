export type ListingRecord = {
  id: string
  month: string
  city?: string
  district?: string
  project?: string
  productType?: string
  avgPrice?: number
  unitsSold?: number
  area?: number
  revenue?: number
}

export type SheetSummary = {
  name: string
  month: string
  rows: number
}

export type Dataset = {
  records: ListingRecord[]
  sheets: SheetSummary[]
}

export type MonthlyPoint = {
  month: string
  units: number
  revenue: number
  avgPrice: number
}

export type DistrictSlice = {
  name: string
  units: number
  revenue: number
}

export type ProductSlice = {
  name: string
  units: number
  revenue: number
}

export type PriceBand = {
  band: string
  count: number
}

export type DatasetMetrics = {
  totalUnits: number
  totalRevenue: number
  avgPrice: number
  months: string[]
  monthly: MonthlyPoint[]
  districts: DistrictSlice[]
  productTypes: ProductSlice[]
  priceBands: PriceBand[]
}

export type AnalysisPayload = {
  locale?: 'en' | 'zh'
  metrics: DatasetMetrics
  samples: ListingRecord[]
}
