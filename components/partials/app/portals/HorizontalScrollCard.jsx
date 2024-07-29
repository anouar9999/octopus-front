import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { openPortalModal } from "./store";
import { useDispatch } from "react-redux";

const HorizontalScrollCard = ({params, city }) => {
  const [regions, setRegions] = useState([]);
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
const isAdmin =userData?.user.is_admin;
  useEffect(() => {
    console.log(params)
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${city}/regions/`
        );
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
        throw error;
      }
    };
    fetchRegions();
  }, [city]);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        className="flex overflow-x-scroll pb-3 hide-scroll-bar"
        ref={scrollContainerRef}
      >
        <div className="flex flex-nowrap">
          <div className="inline-block px-3">
            <a
              onClick={() =>
                dispatch(
                      openPortalModal({
                        open: true,
                        categoryId: params.categorie,
                      })
                    )
              }
              className="grid mb-6 rounded-lg bg-white p-6 place-items-center rounded-xl bg-white px-3 py-2 transition-all hover:scale-105 hover:border-blue-gray-100 hover:bg-blue-gray-50 hover:bg-opacity-25 w-full"
              href="#"
            >
              <span className="my-6 grid h-40 w-60 place-items-center">
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
              <h5 className="text-sm capitalize font-semibold text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                Ajouter un Region
              </h5>
            </a> 
          </div>
          {regions.map((region) => (
            <div className="inline-block px-3" key={region.id}>
              <div className="w-64 h-60 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <article className="flex flex-col rounded-lg h-64 border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded bg-blue-600 p-2 text-white w-10 h-10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 14l9-5-9-5-9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l9-5-9-5-9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                    </span>
                    <div className="flex items-center gap-3">
                      {isAdmin && (
                        <div>
                          <Dropdown
                            classMenuItems="w-[130px]"
                            label={
                              <span className="font-sans text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                                <Icon icon="heroicons-outline:dots-vertical" />
                              </span>
                            }
                          >
                            <div>
                              <Menu.Item onClick={() => handleUpdate()}>
                                <div className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm dark:text-slate-300 last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center capitalize rtl:space-x-reverse">
                                  <span className="text-base">
                                    <Icon icon="heroicons-outline:pencil-alt" />
                                  </span>
                                  <span>Edit</span>
                                </div>
                              </Menu.Item>
                              <Menu.Item onClick={() => handleDelete()}>
                                <div className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm dark:text-slate-300 last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center capitalize rtl:space-x-reverse">
                                  <span className="text-base">
                                    <Icon icon="heroicons-outline:trash" />
                                  </span>
                                  <span>Delete</span>
                                </div>
                              </Menu.Item>
                            </div>
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  </div>

                  <a href="#">
                    <h3 className="mt-3 text-lg font-medium text-gray-900">{region.name}</h3>
                  </a>

                  <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                    {region.description}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={"/"}
                      className="group inline-flex items-end gap-1 text-sm font-medium text-blue-600"
                    >
                      Find out more
                      <span aria-hidden="true" className="block transition-all group-hover:ms-0.5 rtl:rotate-180">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>

      {regions.length >= 2 && (
        <>
          <div className="absolute top-0 left-0 h-full flex items-center">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black-700 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300"
              onClick={handleScrollLeft}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute top-0 right-0 h-full flex items-center">
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black-700 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300"
              onClick={handleScrollRight}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HorizontalScrollCard;
