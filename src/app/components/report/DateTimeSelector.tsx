"use client";

import React, { ChangeEvent } from 'react';

interface DateTimeSelectorProps {
  formData: {
    datetime: string;
  };
  modifyDate: boolean;
  customDate: string;
  customTime: string;
  onModifyDateToggle: (e: ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = React.memo(({
  formData,
  modifyDate,
  customDate,
  customTime,
  onModifyDateToggle,
  onDateChange,
  onTimeChange
}) => {
  return (
    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--card)' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--footer)' }}>📅 Date & Time</p>
          <p className="text-sm" style={{ color: 'var(--footer)' }}>{formData.datetime}</p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            name="modifyDate"
            checked={modifyDate}
            onChange={onModifyDateToggle}
          />
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${modifyDate ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${modifyDate ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
          <span className="ml-2 text-sm" style={{ color: 'var(--footer)' }}>Custom date/time</span>
        </label>
      </div>

      {modifyDate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 rounded-lg border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card)' }}>
          <div>
            <label htmlFor="datePicker" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Date
            </label>
            <input
              type="date"
              id="datePicker"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--card)' 
              }}
              value={customDate}
              onChange={onDateChange}
            />
          </div>
          <div>
            <label htmlFor="timePicker" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Time
            </label>
            <input
              type="time"
              id="timePicker"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--card)' 
              }}
              value={customTime}
              onChange={onTimeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
});

DateTimeSelector.displayName = 'DateTimeSelector';

export default DateTimeSelector;
