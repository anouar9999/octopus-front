"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Plus, Search, Grid, List, Settings, Trash2, Edit3, ExternalLink, Filter } from "lucide-react";
import {
  editPortalModel,
  deletePortal,
  openPortalModal,
  editcategorieModel,
} from "@/components/partials/app/portals/store";
import AddPortal from "@/components/partials/app/portals/AddPortals";
import GridPortals from "@/components/partials/app/portals/GridPortals";
import UpdatePortal from "@/components/partials/app/portals/updatePortals/UpdatePortals";
import HomeBredCurbs from "@/components/partials/HomeBredCurbs";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { toast } from "react-toastify";

const BankingPage = ({ params }) => {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', etc.
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    fetchPortals();
  }, []);

  const fetchPortals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/by-company/${params.id}/`
      );
      setPortals(response.data);
    } catch (error) {
      toast.error("Failed to load portals");
    } finally {
      setLoading(false);
    }
  };

  const filteredPortals = portals.filter(portal =>
    portal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <HomeBredCurbs title="Portals" /> */}
      <Breadcrumbs />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Portals Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and organize your company portals
              </p>
            </div>
            
            <button
              onClick={() => dispatch(openPortalModal({ open: true }))}
              className="inline-flex items-center px-4 py-2 bg-[#0b77b7] hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Portal
            </button>
          </div>

          {/* Filters and Search */}
          {/* <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search portals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-blue-50 text-[#0b77b7] dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-[#0b77b7] dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <List className="w-5 h-5" />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div> */}
        </div>

        {/* Portals Grid/List */}
        {loading ? (
          <PortalsLoadingSkeleton viewMode={viewMode} />
        ) : filteredPortals.length === 0 ? (
          <EmptyState onAdd={() => dispatch(openPortalModal({ open: true }))} />
        ) : (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" :
            "space-y-4"
          }>
            {filteredPortals.map((portal) => (
              <PortalCard
                key={portal.id}
                portal={portal}
                viewMode={viewMode}
                onDelete={async () => {
                  try {
                    await axios.delete(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${portal.id}/`
                    );
                    toast.success("Portal deleted successfully");
                    fetchPortals();
                  } catch (error) {
                    toast.error("Failed to delete portal");
                  }
                }}
                onEdit={() => dispatch(editcategorieModel({ open: true, categoryId: portal.id }))}
                onView={() => router.push(`/admin-portal/${params.id}/${portal.name}/sub-portal/`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPortal companyID={params.id} />
      <UpdatePortal companyID={params.categorie} />
    </div>
  );
};

const PortalCard = ({ portal, viewMode, onDelete, onEdit, onView }) => {
  const [showActions, setShowActions] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#0b77b7]" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {portal.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {portal.description || 'No description'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onView}
              className="p-2 text-gray-500 hover:text-[#0b77b7] hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 relative overflow-hidden"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-6">
        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
          <Settings className="w-6 h-6 text-[#0b77b7]" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {portal.name}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {portal.description || 'No description provided'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className={`absolute inset-0 bg-gray-900/10 dark:bg-gray-900/20 flex items-center justify-center gap-2 transition-opacity duration-200 ${
        showActions ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={onView}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ExternalLink className="w-5 h-5 text-[#0b77b7]" />
        </button>
        <button
          onClick={onEdit}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Edit3 className="w-5 h-5 text-yellow-500" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ onAdd }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Settings className="w-8 h-8 text-[#0b77b7]" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      No Portals Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Get started by creating your first portal
    </p>
    <button
      onClick={onAdd}
      className="inline-flex items-center px-4 py-2 bg-[#0b77b7] hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
    >
      <Plus className="w-5 h-5 mr-2" />
      Add Portal
    </button>
  </div>
);

const PortalsLoadingSkeleton = ({ viewMode }) => (
  <div className={viewMode === 'grid' ? 
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" :
    "space-y-4"
  }>
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6"
      >
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
    ))}
  </div>
);

export default BankingPage;