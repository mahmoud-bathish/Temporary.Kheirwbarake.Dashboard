'use client';

import { UnprofitableItemDto } from '@/types/unprofitable-items';
import { useState, useMemo } from 'react';

interface UnprofitableItemsTableProps {
  items: UnprofitableItemDto[];
  itemsCount: number;
}

export default function UnprofitableItemsTable({ items, itemsCount }: UnprofitableItemsTableProps) {
  const [sortField, setSortField] = useState<keyof UnprofitableItemDto | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFamily, setSelectedFamily] = useState<string>('');

  const handleSort = (field: keyof UnprofitableItemDto) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get unique categories and families for filter dropdowns
  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(items.map(item => item.categoryName))].sort();
    return categories;
  }, [items]);

  const uniqueFamilies = useMemo(() => {
    const families = [...new Set(items.map(item => item.familyName))].sort();
    return families;
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter(item => {
      const categoryMatch = !selectedCategory || item.categoryName === selectedCategory;
      const familyMatch = !selectedFamily || item.familyName === selectedFamily;
      return categoryMatch && familyMatch;
    });

    if (!sortField) return filtered;
    
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle numeric values
      if (sortField === 'selPrice' || sortField === 'costPrice' || sortField === 'currentQte') {
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // Handle string values
      const comparison = aValue.localeCompare(bValue, 'ar', { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, selectedCategory, selectedFamily, sortField, sortDirection]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedFamily('');
  };

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('ar-EG');
  };

  const getSortIcon = (field: keyof UnprofitableItemDto) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">العناصر غير المربحة</h1>
        <p className="text-gray-600">إجمالي العناصر: {itemsCount.toLocaleString('ar-EG')}</p>
        {filteredAndSortedItems.length !== itemsCount && (
          <p className="text-gray-600">العناصر المفلترة: {filteredAndSortedItems.length.toLocaleString('ar-EG')}</p>
        )}
      </div>

      {/* Filter Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 cursor-pointer">
              تصفية حسب الفئة:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">جميع الفئات</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="family-filter" className="text-sm font-medium text-gray-700 cursor-pointer">
              تصفية حسب القسم:
            </label>
            <select
              id="family-filter"
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">جميع الأقسام</option>
              {uniqueFamilies.map(family => (
                <option key={family} value={family}>{family}</option>
              ))}
            </select>
          </div>

          {(selectedCategory || selectedFamily) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors cursor-pointer"
            >
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('itemId')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{getSortIcon('itemId')}</span>
                    <span className="text-right w-full">رقم العنصر</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('itemName')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{getSortIcon('itemName')}</span>
                    <span className="text-right w-full">اسم العنصر</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('categoryName')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{getSortIcon('categoryName')}</span>
                    <span className="text-right w-full">الفئة</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('familyName')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{getSortIcon('familyName')}</span>
                    <span className="text-right w-full">القسم</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('currentQte')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{getSortIcon('currentQte')}</span>
                    <span className="text-right w-full">الكمية الحالية</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('costPrice')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{getSortIcon('costPrice')}</span>
                    <span className="text-right w-full">سعر التكلفة</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('selPrice')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{getSortIcon('selPrice')}</span>
                    <span className="text-right w-full">سعر البيع</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="text-right w-full">الخسارة</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedItems.map((item, index) => {
                const selPrice = parseFloat(item.selPrice);
                const costPrice = parseFloat(item.costPrice);
                const loss = costPrice - selPrice;
                const lossPercentage = ((loss / costPrice) * 100).toFixed(2);
                
                return (
                  <tr key={item.itemId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {item.itemId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.familyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(item.currentQte)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(item.costPrice)} {item.itemFileCurrencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(item.selPrice)} {item.itemFileCurrencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {formatNumber(loss.toFixed(2))} {item.itemFileCurrencyCode}
                        <span className="ml-1">({lossPercentage}%)</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
