"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Plus, MapPin } from "lucide-react";
import {
  openPortalModal,
  editCityModel,
} from "@/components/partials/app/portals/store";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { toast } from "react-toastify";
import AddCity from "@/components/partials/app/portals/AddCity";
import AddRegion from "@/components/partials/app/portals/AddRegion";
import UpdateCity from "@/components/partials/app/portals/updatePortals/UpdateCity";
import ListCity from "@/components/partials/app/portals/ListCity";

const SubPortalPage = ({ params }) => {
  const [subPortals, setSubPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state.auth.userData);
  const isAdmin = userData?.user?.is_admin || false;

  useEffect(() => {
    fetchCities();
  }, [params.subcategorie]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${params.subcategorie}/cities/`
      );
      setSubPortals(response.data);
    } catch (error) {
      toast.error("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#0b77b7]" />
                Cities Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and organize your cities structure
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => dispatch(openPortalModal({ open: true, categoryId: params.categorie }))}
                className="inline-flex items-center px-4 py-2 bg-[#0b77b7] hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add City
              </button>
            )}
          </div>
        </div>

        {/* Cities Grid */}
        {loading ? (
          <CitiesSkeleton />
        ) : subPortals.length === 0 ? (
          <EmptyState 
            isAdmin={isAdmin}
            onAdd={() => dispatch(openPortalModal({ open: true, categoryId: params.categorie }))}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subPortals.map((portal) => (
              <ListCity
                key={portal.id}
                portal={portal}
                link={`/admin-portal/${params.id}/${params.categorie}/sub-portal/${portal.name}/cities/`}
                subCategoryName={params.subcategorie}
                handleUpdate={() => {
                  dispatch(editCityModel({ open: true, CityID: portal.id }));
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCity SubCategorieID={params.subcategorie} />
      <AddRegion />
      <UpdateCity />
    </div>
  );
};

const EmptyState = ({ isAdmin, onAdd }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <MapPin className="w-8 h-8 text-[#0b77b7]" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      No Cities Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      {isAdmin 
        ? "Get started by creating your first city"
        : "No cities are available at the moment"
      }
    </p>
    {isAdmin && (
      <button
        onClick={onAdd}
        className="inline-flex items-center px-4 py-2 bg-[#0b77b7] hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add City
      </button>
    )}
  </div>
);

const CitiesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

export default SubPortalPage;