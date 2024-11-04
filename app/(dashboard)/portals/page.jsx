"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icon";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
  openPortalModal,
  deletePortal,
} from "@/components/partials/app/portals/store";
import AddPortal from "@/components/partials/app/portals/AddPortals";
import GridPortals from "@/components/partials/app/portals/GridPortals";
import UpdatePortal from "@/components/partials/app/portals/updatePortals/UpdatePortals";

const BankingPage = ({ params }) => {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state.auth.userData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!userData?.companies?.[0]?.id) return;
    fetchPortals();
  }, [userData]);

  const fetchPortals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/by-company/${userData.companies[0].id}/`
      );
      setPortals(response.data);
    } catch (error) {
      console.error("Error fetching portals:", error);
      toast.error("Error fetching portals", {
        position: "top-right",
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  const filteredPortals = portals.filter(portal => 
    portal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-4">
          <Breadcrumbs />
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon icon="heroicons-outline:template" className="w-8 h-8 text-blue-500" />
                Portals Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and organize your portal structure
              </p>
            </div>

            {userData?.user?.is_admin && (
              <button
                onClick={() => dispatch(openPortalModal({ open: true }))}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Icon icon="heroicons-outline:plus" className="w-5 h-5 mr-2" />
                Add Portal
              </button>
            )}
          </div>

        
        </div>

        {/* Portals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 mx-auto" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPortals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="heroicons-outline:template" className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Portals Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first portal"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userData?.user?.is_admin && (
              <button
                onClick={() => dispatch(openPortalModal({ open: true }))}
                className="relative group h-full min-h-[200px] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon="heroicons-outline:plus" className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Add New Portal
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Click to create a new portal
                </p>
              </button>
            )}

            {filteredPortals.map((portal) => (
              <GridPortals
                key={portal.id}
                portal={portal}
                link={`/portals/${portal.name}/sub-portal/`}
                handleDelete={() => dispatch(deletePortal({ categoryId: portal.id }))}
              />
            ))}
          </div>
        )}

        <AddPortal />
        <UpdatePortal companyID={params.categorie} />
      </div>
    </div>
  );
};

export default BankingPage;