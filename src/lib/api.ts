import { ApiResponse, UnprofitableItemsResponse } from '@/types/unprofitable-items';

const API_BASE_URL = 'https://kheirwbarake-backend.onrender.com/api';

export async function fetchUnprofitableItems(): Promise<ApiResponse<UnprofitableItemsResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/TemporaryDashboard/unprofitable-items`, {
      method: 'GET',
      headers: {
        'accept': 'text/plain',
      },
      // Add cache control for better performance
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching unprofitable items:', error);
    throw error;
  }
}
