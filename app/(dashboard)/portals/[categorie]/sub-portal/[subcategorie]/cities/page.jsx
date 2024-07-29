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
  deleteCity,
  editCityModel,
} from "@/components/partials/app/portals/store";
import AddPortal from "@/components/partials/app/portals/AddPortals";
import AddSubPortal from "@/components/partials/app/portals/AddSubPortal";
import GridPortals from "@/components/partials/app/portals/GridPortals";
import UpdateSubPortal from "@/components/partials/app/portals/updatePortals/UpdateSubPortal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import UpdateCity from "@/components/partials/app/portals/updatePortals/UpdateCity";
import AddCity from "@/components/partials/app/portals/AddCity";
import ListCity from "@/components/partials/app/portals/ListCity";
import AddRegion from "@/components/partials/app/portals/AddRegion";
import { toast } from "react-toastify";

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${params.subcategorie}/cities/`
        );
        setSubPortals(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching portals:", error);
      }
    };
    fetchPortals();
  }, [params.subcategorie]);

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  const handleDelete = async (subCategoryId, cityId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${subCategoryId}/cities/${cityId}/`
      );
      if (response.status === 204) {
        toast.error("City deleted successfully", {
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
        console.error("Error deleting city:", response.data);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <>
      <HomeBredCurbs title="Cities and Regions" />
      <Breadcrumbs />

      <div className="flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {!subPortals.length && (
            <div className="flex items-center justify-center">
              <p className="text-lg text-gray-500">No cities available.</p>
            </div>
          )}
          <p className="text-base font-light leading-relaxed text-gray-600 mb-4"></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="frameworks-integration">
         

            {subPortals.map((portal) => (
              <ListCity
                key={portal.id}
                portal={portal}
                link={`/portals/${params.categorie}/sub-portal/${params.subcategorie}/cities/${portal.name}/region/`}
                handleDelete={() => handleDelete(params.subcategorie, portal.id)}
                handleUpdate={() => {
                  dispatch(editCityModel({ open: true, CityID: portal.id }));
                }}
              />
            ))}

            <AddCity SubCategorieID={params.subcategorie} />
            <AddRegion />
            {/* <UpdateCity /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubPortalPage;