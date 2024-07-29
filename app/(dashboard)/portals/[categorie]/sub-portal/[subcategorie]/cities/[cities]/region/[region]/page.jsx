"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CardSlider = dynamic(
  () => import("@/components/partials/widget/CardSlider"),
  {
    ssr: false,
  }
);
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeBredCurbs from "@/components/partials/HomeBredCurbs";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteRegion, openPortalModal } from "@/components/partials/app/portals/store";
import AddPortal from "@/components/partials/app/portals/AddPortals";
import AddSubPortal from "@/components/partials/app/portals/AddSubPortal";
import AddCity from "@/components/partials/app/portals/AddCity";
import AddRegion from "@/components/partials/app/portals/AddRegion";
import GridPortals from "@/components/partials/app/portals/GridPortals";

const BankingPage = ({params}) => {
  const [Subportals, setSubPortals] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log(params)
    const fetchPortals = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${params.categorie}/subcategories/${params.cities}/cities/${params.region}/regions/`);
        console.log(response.data);
        setSubPortals(response.data);
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
      <HomeBredCurbs title="Region" />
      <div class="flex  items-center justify-center ">
        <div>
          <p class="block w-screen antialiased font-sans text-base font-light leading-relaxed text-inherit !mb-4 !font-normal !text-gray-600"></p>
          <div
            class="mx-6 grid grid-cols-2 gap-6 md:grid-cols-4"
            id="frameworks-integration"
          >
            <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg sm:p-6">
              <a
                onClick={() => dispatch(openPortalModal({ open: true,categoryId:params.categorie }))}
                class="grid  mb-6 rounded-lg bg-white p-6 place-items-center rounded-xl  bg-white px-3 py-2 transition-all hover:scale-105 hover:border-blue-gray-100 hover:bg-blue-gray-50 hover:bg-opacity-25"
                href="#"
              >
                <span class="my-6 grid h-24 w-24 place-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
                    ></path>
                  </svg>
                </span>
                <h5 className="  text-sm capitalize font-semibold text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                  Ajouter un Region
                </h5>
              </a>
            </article>
            {Subportals.map((portal) => (
                          <GridPortals portal={portal} link={`/all-projects`}  handleDelete={()=>dispatch(deleteRegion(portal.id))} />

           
            ))}
            <AddRegion CityID={params.cities} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BankingPage;
