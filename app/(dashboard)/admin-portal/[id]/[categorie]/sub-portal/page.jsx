"use client"
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

const CardSlider = dynamic(
  () => import("@/components/partials/widget/CardSlider"),
  {
    ssr: false,
  }
);

const SubPortalPage = ({ params }) => {
  const [Subportals, setSubPortals] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state.auth.userData);

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
        toast.error("Error fetching sub-portals");
      }
    };
    fetchPortals();
  }, [params.categorie]);

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  const isAdmin = userData?.user?.is_admin || false;

  return (
    <>
      <HomeBredCurbs title="Sub Portals" />
      <Breadcrumbs />

      <div className="flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {!Subportals.length && (
            <div className="flex items-center justify-center">
              <p className="text-lg text-gray-500">No sub-portals available.</p>
            </div>
          )}
          <p className="text-base font-light leading-relaxed text-gray-600 mb-4"></p>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            id="frameworks-integration"
          >
            {isAdmin && (
              <article className="rounded-lg flex justify-between border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-lg">
                <button 
                  onClick={() => dispatch(openPortalModal({ open: true, categoryId: params.categorie }))}
                  className="w-full text-left transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex flex-col justify-between items-center">
                    <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Ajouter un Sub-Portal
                    </h2>
                  </div>
                </button>
              </article>
            )}

            {Subportals.map((portal) => (
              <GridPortals
                key={portal.id}
                portal={portal}
                link={`/admin-portal/${params.id}/${params.categorie}/sub-portal/${portal.name}/cities/`}
                handleDelete={async () => {
                  try {
                    const response = await axios.delete(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${params.categorie}/subcategories/${portal.id}/`
                    );
                    if (response.status === 204) {
                      toast.success("Sub-Portal deleted successfully", {
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
                      toast.error("Error deleting sub-portal");
                    }
                  } catch (error) {
                    console.error("An unexpected error occurred:", error);
                    toast.error("An error occurred while deleting the sub-portal");
                  }
                }}
                handleUpdate={() =>
                  dispatch(editSubCategorieModel({ open: true, categoryId: portal.id }))
                }
              />
            ))}

            <UpdateSubPortal />
            <AddSubPortal categoryId={params.categorie} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SubPortalPage;