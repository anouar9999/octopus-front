"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import HomeBredCurbs from "@/components/partials/HomeBredCurbs";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
  openPortalModal,
  deletePortal,
} from "@/components/partials/app/portals/store";
import AddPortal from "@/components/partials/app/portals/AddPortals";
import GridPortals from "@/components/partials/app/portals/GridPortals";
import UpdatePortal from "@/components/partials/app/portals/updatePortals/UpdatePortals";

const CardSlider = dynamic(() => import("@/components/partials/widget/CardSlider"), {
  ssr: false,
});

const BankingPage = ({ params }) => {
  const [portals, setPortals] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state.auth.userData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!userData?.companies?.[0]?.id) return;

    const fetchPortals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/by-company/${userData.companies[0].id}/`
        );
        setPortals(response.data);
      } catch (error) {
        console.error("Error fetching portals:", error);
        toast.error("Error fetching portals", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    };

    fetchPortals();
  }, [userData]);

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  return (
    <>
      <Breadcrumbs />
      <h3 className="text-3xl font-bold text-gray-800 mb-6">Portals</h3>

      <div className="flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {!portals.length && (
            <div className="flex items-center justify-center">
              <p className="text-lg text-gray-500">No portals available.</p>
            </div>
          )}
          <p className="text-base font-light leading-relaxed text-gray-600 mb-4"></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="frameworks-integration">
            {userData?.user?.is_admin && (
              <article className="rounded-lg border border-gray-100 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-lg">
                <a
                  onClick={() => dispatch(openPortalModal({ open: true }))}
                  className="grid mb-6 rounded-lg bg-white p-6 place-items-center rounded-xl bg-white px-3 py-2 transition-all hover:scale-105 hover:border-blue-gray-100 hover:bg-blue-gray-50 hover:bg-opacity-25"
                  href="#"
                >
                  <span className="my-6 grid h-24 w-24 place-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
                      ></path>
                    </svg>
                  </span>
                  <h5 className="text-sm capitalize font-semibold text-slate-900 inline-block pr-4 sm:pl-4">
                    Add Portal
                  </h5>
                </a>
              </article>
            )}

            {portals.map((portal) => (
              <GridPortals
                key={portal.id}
                portal={portal}
                link={`/portals/${portal.name}/sub-portal/`}
                handleDelete={() =>
                  dispatch(deletePortal({ categoryId: portal.id }))
                }
              />
            ))}

            <AddPortal />
            <UpdatePortal companyID={params.categorie} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BankingPage;