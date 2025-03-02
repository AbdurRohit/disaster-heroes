"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

interface FormData {
  title: string;
  description: string;
  datetime: string;
  categories: string[];
  fullName: string;
  email: string;
  phoneNumber: string;
  locationLandmark: string;
  newsSourceLink: string;
  mediaLink: string;
}

const ReportForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    datetime: 'Today at 1:30',
    categories: [],
    fullName: '',
    email: '',
    phoneNumber: '',
    locationLandmark: '',
    newsSourceLink: '',
    mediaLink: ''
  });
  
  const [modifyDate, setModifyDate] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, value]
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(category => category !== value)
      });
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomDate(e.target.value);
    updateDateTime(e.target.value, customTime);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomTime(e.target.value);
    updateDateTime(customDate, e.target.value);
  };

  const updateDateTime = (date: string, time: string) => {
    if (date && time) {
      // Format the date to a more readable format
      const formattedDate = new Date(date);
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      const dateStr = formattedDate.toLocaleDateString('en-US', options);
      setFormData({
        ...formData,
        datetime: `${dateStr} at ${time}`
      });
    }
  };

  const handleModifyDateToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setModifyDate(e.target.checked);
    
    // Set default values for the date and time pickers
    if (e.target.checked && !customDate) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setCustomDate(today);
      setCustomTime(currentTime);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submission logic here
  };

  return (
    <div className="max-w-8xl mx-auto p-4 bg-gray-50">
      <div className="mt-8">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Submit a new report</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Report title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                className="w-full border border-gray-300 rounded-md p-2 bg-white"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-700">Date & time at: {formData.datetime}</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4"
                    name="modifyDate"
                    checked={modifyDate}
                    onChange={handleModifyDateToggle}
                  />
                  <span className="ml-2 text-sm text-gray-600">Modify date</span>
                </label>
              </div>
              
              {modifyDate && (
                <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        id="datePicker"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={customDate}
                        onChange={handleDateChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="timePicker" className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        id="timePicker"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={customTime}
                        onChange={handleTimeChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value="earthquake"
                    className="form-checkbox h-4 w-4"
                    onChange={handleCategoryChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">Earthquake</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value="flashFlood"
                    className="form-checkbox h-4 w-4"
                    onChange={handleCategoryChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">Flash Flood</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value="forestFire"
                    className="form-checkbox h-4 w-4"
                    onChange={handleCategoryChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">Forest Fire</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value="forestFire2"
                    className="form-checkbox h-4 w-4"
                    onChange={handleCategoryChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">Forest Fire</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value="accident"
                    className="form-checkbox h-4 w-4"
                    onChange={handleCategoryChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">Accident</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value="others"
                    className="form-checkbox h-4 w-4"
                    onChange={handleCategoryChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">Others</span>
                </label>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Optional Information:</p>
              
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="w-full border border-gray-300 rounded-md p-2 bg-white"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email id
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border border-gray-300 rounded-md p-2 bg-white"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="w-full border border-gray-300 rounded-md p-2 bg-white"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>

    
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="w-full h-72 relative rounded-lg overflow-hidden border border-gray-300">
              <div className="absolute inset-0">
                {/* Replace with actual map component - using an image as placeholder */}
                <Image 
                  src="/api/placeholder/500/300" 
                  alt="Map" 
                  layout="fill" 
                  objectFit="cover"
                />
                <div className="absolute top-2 left-2 bg-white rounded p-1 text-xs">
                  <button className="px-2 py-1 text-gray-700">Map</button>
                  <button className="px-2 py-1 text-gray-500">Satellite</button>
                </div>
                <div className="absolute top-2 right-2 bg-white rounded p-1">
                  <button className="p-1">+</button>
                  <button className="p-1">-</button>
                </div>
                <div className="absolute bottom-1 left-1 text-xs text-gray-700">
                  Map data ©2023 Google · Terms of Use · Report a map error
                </div>
              </div>
            </div>

            <div className="flex">
              <input
                type="text"
                placeholder="Search location..."
                className="flex-grow border border-gray-300 rounded-l-md p-2 bg-white"
              />
              <button
                type="button"
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-r-md"
              >
                Find Location
              </button>
            </div>

            <div>
              <label htmlFor="locationLandmark" className="block text-sm font-medium text-gray-700 mb-1">
                Location landmark
              </label>
              <input
                type="text"
                id="locationLandmark"
                name="locationLandmark"
                className="w-full border border-gray-300 rounded-md p-2 bg-white"
                value={formData.locationLandmark}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="newsSourceLink" className="block text-sm font-medium text-gray-700 mb-1">
                News source link
              </label>
              <input
                type="url"
                id="newsSourceLink"
                name="newsSourceLink"
                className="w-full border border-gray-300 rounded-md p-2 bg-white"
                value={formData.newsSourceLink}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="mediaLink" className="block text-sm font-medium text-gray-700 mb-1">
                Image / Video
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="mediaLink"
                  name="mediaLink"
                  placeholder="Link to the media"
                  className="flex-grow border border-gray-300 rounded-l-md p-2 bg-white"
                  value={formData.mediaLink}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="bg-white border border-gray-300 border-l-0 rounded-r-md px-4 py-2 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Upload Media
                </button>
                
              </div>

              <div className="flex space-x-4 pt-10">
              <button
                type="button"
                className="border border-gray-300 rounded-md px-6 py-2 bg-white text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 py-2"
              >
                Submit
              </button>
            </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;