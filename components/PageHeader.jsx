import React, { useState } from 'react';
import { Search, Plus, Filter, ArrowDownToLine } from 'lucide-react';

const PageHeader = ({ title,subTitle }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="relative">
      {/* Main Header */}
      <div className="p-8  rounded-b-3xl  ">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                {title}
              </h1>
              <p className="text-gray-400 text-sm">
                 {subTitle } 
              </p>
            </div>
            
            
          </div>

       
        </div>
      </div>

     
    </div>
  );
};

export default PageHeader;