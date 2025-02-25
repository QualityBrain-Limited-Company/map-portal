// app/types/filter.ts
export interface FilterOptions {
    categoryId?: number
    province?: string
    searchTerm?: string
  }
  
  export interface SearchResult {
    documents: MapDocument[]
    total: number
  }