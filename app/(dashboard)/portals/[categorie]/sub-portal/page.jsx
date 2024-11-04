"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeBredCurbs from "@/components/partials/HomeBredCurbs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  openPortalModal,
  deleteSubPortal,
  editPortalModel,
  editSubCategorieModel,
} from "@/components/partials/app/portals/store";
import AddPortal from "@/components/partials/app/portals/AddPortals";
import AddSubPortal from "@/components/partials/app/portals/AddSubPortal";
import GridPortals from "@/components/partials/app/portals/GridPortals";
import UpdateSubPortal from "@/components/partials/app/portals/updatePortals/UpdateSubPortal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icon";

const CardSlider = dynamic(() => import("@/components/partials/widget/CardSlider"), {
  ssr: false,
});

const SubPortalPage = ({ params }) => {
  const [subPortals, setSubPortals] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state.auth.userData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchPortals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${params.categorie}/subcategories/`
        );
        setSubPortals(response.data);
      } catch (error) {
        console.error("Error fetching portals:", error);
      }
    };
    fetchPortals();
  }, [params.categorie]);

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  const handleDelete = async (categoryId, portalId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}/subcategories/${portalId}/`
      );
      if (response.status === 204) {
        toast.error("Sub-Portal deleted successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.error("Error deleting sub-portal:", response.data);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-4">

 
      <Breadcrumbs />
    
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon icon="heroicons-outline:template" className="w-8 h-8 text-blue-500" />
                Sub-Portals Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and organize your sub-portal structure
              </p>
         
      <div className="flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {!subPortals.length && (
            <div className="flex items-center justify-center">
              <p className="text-lg text-gray-500">No portals available.</p>
            </div>
          )}
          <p className="text-base font-light leading-relaxed text-gray-600 mb-4"></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="frameworks-integration">
           

            {subPortals.map((portal) => (
              <GridPortals
                key={portal.id}
                portal={portal}
                link={`/portals/${params.categorie}/sub-portal/${portal.name}/cities/`}
                handleDelete={() => handleDelete(params.categorie, portal.id)}
                handleUpdate={() =>
                  dispatch(
                    editSubCategorieModel({ open: true, categoryId: portal.id })
                  )
                }
              />
            ))}

            <UpdateSubPortal />
            <AddSubPortal categoryId={params.categorie} />
          </div>
        </div>
      </div>
    </div>
    </div></div>
  );
};

export default SubPortalPage; 
