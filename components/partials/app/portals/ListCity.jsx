import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { openRegionModal } from "./store";
import { usePathname, useRouter } from 'next/navigation';
import { toast } from "react-toastify";

const ListCity = ({ portal, link, subCategoryName, handleUpdate }) => {
  const { id, name, image, smallTitles } = portal;
  const [regions, setRegions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const isAdmin = userData?.user?.is_admin || false;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${name}/regions/`
        );
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, [name]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${subCategoryName}/cities/${id}/`
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
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const pathParts = pathname.split('/');
  const adminPortalIndex = pathParts.indexOf('admin-portal');
  const PortalIndex = pathParts.indexOf('portals');
  const idIndex = adminPortalIndex + 1;
  const categorieIndex = adminPortalIndex + 2;
  const subcategorieIndex = adminPortalIndex + 4;
  const UsercategorieIndex = PortalIndex + 1;
  const UsersubcategorieIndex = PortalIndex + 3;
  const adminId = pathParts[idIndex] || '';
  const categorie = pathParts[categorieIndex] || '';
  const subcategorie = pathParts[subcategorieIndex] || '';
  const Usercategorie = pathParts[UsercategorieIndex] || '';
  const Usersubcategorie = pathParts[UsersubcategorieIndex] || '';

  return (
    <>
      <div 
        className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 cursor-pointer"
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-72">
          <img
            alt={name}
            src={image}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.3) 100%)',
              opacity: isHovered ? 0.9 : 0.7,
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex justify-between items-start" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                {name}
              </h2>
              {isAdmin && (
                <Dropdown
                  classMenuItems="w-[130px]"
                  label={
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <Icon icon="heroicons-outline:dots-vertical" />
                    </span>
                  }
                >
                  <Menu.Item onClick={handleUpdate}>
                    <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Icon icon="heroicons-outline:pencil-alt" className="mr-2" />
                      <span>Edit</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item onClick={handleDelete}>
                    <div className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <Icon icon="heroicons-outline:trash" className="mr-2" />
                      <span>Delete</span>
                    </div>
                  </Menu.Item>
                </Dropdown>
              )}
            </div>

            <div className="mt-auto" onClick={e => e.stopPropagation()}>
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(openRegionModal({ open: true, CityID: name }));
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Icon icon="heroicons-outline:plus" className="mr-1.5" />
                  Add Region
                </button>
              )}

              <div className="mt-4 flex items-center text-white">
                <Icon icon="heroicons-outline:location-marker" className="mr-2" />
                <span>{regions.length} Regions Available</span>
                <Icon icon="heroicons-outline:chevron-right" className="ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regions Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl max-w-lg w-full m-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Icon icon="heroicons-outline:location-marker" className="text-blue-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{name}</h3>
                    <p className="text-sm text-gray-400">{regions.length} Regions Available</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 hover:bg-white/10 transition-colors"
                >
                  <Icon icon="heroicons-outline:x" className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {regions.map((region, index) => (
                  <a 
                    href={isAdmin ?
                      `/admin-portal/${adminId}/${categorie}/sub-portal/${subcategorie}/cities/all-projects/${region.name}`
                      : `/portals/${Usercategorie}/sub-portal/${Usersubcategorie}/cities/all-projects/${region.name}`}
                    key={index}
                    className="group block"
                  >
                    <div className="flex items-center text-sm text-white py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/10">
                      <Icon 
                        icon="heroicons-outline:location-marker" 
                        className="mr-3 opacity-70 group-hover:opacity-100" 
                      />
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                        {region.name}
                      </span>
                      <Icon 
                        icon="heroicons-outline:chevron-right" 
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        } 
      `}</style>
    </>
  );
};

export default ListCity;