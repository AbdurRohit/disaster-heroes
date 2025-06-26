"use client";

import React, { ChangeEvent } from 'react';

interface CategorySelectorProps {
  categories: string[];
  onCategoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = React.memo(({
  categories,
  onCategoryChange
}) => {
  const categoryOptions = [
    { value: "earthquake", label: "Earthquake", icon: "🏚️" },
    { value: "flashFlood", label: "Flash Flood", icon: "🌊" },
    { value: "forestFire", label: "Forest Fire", icon: "🔥" },
    { value: "accident", label: "Accident", icon: "🚗" },
    { value: "others", label: "Others", icon: "⚠️" }
  ];

  return (
    <div>
      <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        🏷️ Incident Categories
      </label>
      <div className="grid grid-cols-2 gap-3">
        {categoryOptions.map(category => (
          <label key={category.value} className="flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 hover:opacity-80" style={{ borderColor: 'var(--card)', backgroundColor: 'var(--card)' }}>
            <input
              type="checkbox"
              name="categories"
              value={category.value}
              className="sr-only"
              onChange={onCategoryChange}
              checked={categories.includes(category.value)}
            />
            <div className={`w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${categories.includes(category.value) ? 'bg-blue-600 border-blue-600' : ''}`} style={{ borderColor: categories.includes(category.value) ? '' : 'var(--footer)' }}>
              {categories.includes(category.value) && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="mr-2">{category.icon}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--footer)' }}>{category.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
});

CategorySelector.displayName = 'CategorySelector';

export default CategorySelector;
