export interface UnprofitableItemDto {
  itemFileCurrencyCode: string;
  selPrice: string;
  costPrice: string;
  itemId: string;
  itemName: string;
  categoryName: string;
  familyName: string;
  currentQte: string;
}

export interface UnprofitableItemsResponse {
  itemFile: UnprofitableItemDto[];
  itemsCount: number;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  error: unknown;
  data: T;
  isSuccessful: boolean;
}
