import { Suspense } from 'react';
import UnprofitableItemsTable from '@/components/UnprofitableItemsTable';
import { fetchUnprofitableItems } from '@/lib/api';

async function UnprofitableItemsData() {
  try {
    const response = await fetchUnprofitableItems();
    
    if (!response.isSuccessful) {
      throw new Error(response.message || 'Failed to fetch data');
    }

    return (
      <UnprofitableItemsTable 
        items={response.data.itemFile} 
        itemsCount={response.data.itemsCount} 
      />
    );
  } catch (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                خطأ في تحميل البيانات
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>حدث خطأ أثناء تحميل بيانات العناصر غير المربحة. يرجى المحاولة مرة أخرى لاحقاً.</p>
                <p className="mt-1 text-xs">
                  تفاصيل الخطأ: {error instanceof Error ? error.message : 'خطأ غير معروف'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function LoadingSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: 9 }).map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <UnprofitableItemsData />
        </Suspense>
      </div>
    </div>
  );
}
