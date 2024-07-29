"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeBredCurbs from "@/components/partials/HomeBredCurbs";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  editPortalModel,
  deletePortal,
  openPortalModal,
  editcategorieModel,
} from "@/components/partials/app/portals/store";
import AddPortal from "@/components/partials/app/portals/AddPortals";
import GridPortals from "@/components/partials/app/portals/GridPortals";
import { useSelector } from "react-redux";
import UpdatePortal from "@/components/partials/app/portals/updatePortals/UpdatePortals";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { toast } from "react-toastify";

const CardSlider = dynamic(
  () => import("@/components/partials/widget/CardSlider"),
  {
    ssr: false,
  }
);

const BankingPage = ({ params }) => {
  const [portals, setPortals] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchPortals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/by-company/${params.id}/`
        );
        console.log(response.data);
        setPortals(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching portals:", error);
        throw error;
      }
    };
    fetchPortals();
  }, []);

  return (
    <>
      <HomeBredCurbs title="Portals" />
      <Breadcrumbs />
      <div className="flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <p className="text-base font-light leading-relaxed text-gray-600 mb-4"></p>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            id="frameworks-integration"
          >
            <article className="rounded-lg flex justify-between border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-lg">
              <button
                onClick={() => dispatch(openPortalModal({ open: true }))}
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
                    Ajouter un portal
                  </h2>
                </div>
              </button>
            </article>
            {portals.map((portal) => (
              <GridPortals
                key={portal.id}
                portal={portal}
                link={`/admin-portal/${params.id}/${portal.name}/sub-portal/`}
                handleDelete={async () => {
                  try {
                    const response = await axios.delete(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${portal.id}/`
                    );
                    if (response.status === 204) {
                      console.log("Portal deleted successfully");

                      toast.error("Portal deleted successfully", {
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
                      }, 1600);
                    } else {
                      console.error("Error deleting portal:", response.data);
                      // Handle the error according to your application's requirements
                    }
                  } catch (error) {
                    console.error("An unexpected error occurred:", error);
                    // Handle the error according to your application's requirements
                  }
                }}
                handleUpdate={() =>
                  dispatch(
                    editcategorieModel({ open: true, categoryId: portal.id })
                  )
                }
              />
            ))}

            <AddPortal companyID={params.id} />
            <UpdatePortal companyID={params.categorie} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BankingPage;