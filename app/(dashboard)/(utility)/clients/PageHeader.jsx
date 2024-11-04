import React, { useState } from 'react';
import { Search, Plus, Filter, ArrowDownToLine } from 'lucide-react';

const PageHeader = ({ title, globalFilter, setGlobalFilter, onAddClick, totalClients }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="relative">
      {/* Main Header */}
      <div className="p-8 rounded-b-3xl  text-white">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                {title}
              </h1>
              <p className="text-gray-400 text-sm">
                Managing {totalClients || 0} companies in your portfolio
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
                  group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  value={globalFilter || ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full sm:w-96 pl-10 pr-4 py-2 
                    bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent transition-all"
                />
             
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
             
                
                <button
                  onClick={() => onAddClick()}
                  className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 
                    bg-[#0b77b7] text-white hover:bg-blue-600 focus:outline-none focus:ring-2 
                    focus:ring-[#0b77b7] focus:ring-offset-1 focus:ring-offset-gray-800 
                    transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Client</span>
                </button>

              
              </div>
            </div>
          </div>

          {/* Filters Section - Animated */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out
            ${showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t border-gray-600/50">
              <div className="flex flex-wrap gap-3">
                <select
                  className="px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 
                    text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Industries</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
                <select
                  className="px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 
                    text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  className="px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 
                    text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Team Size</option>
                  <option value="small">1-10</option>
                  <option value="medium">11-50</option>
                  <option value="large">50+</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default PageHeader;