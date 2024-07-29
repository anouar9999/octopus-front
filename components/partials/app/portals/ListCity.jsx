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
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const isAdmin = userData?.user?.is_admin || false;
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    console.log(link)
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
 const handleDelete = async ()=>{
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${subCategoryName}/cities/${id}/`
      );

      if (response.status === 204) {

        console.log("City deleted successfully");
        toast.error("City deleted  successfully", {
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
        console.error("Error deleting project:", response.data);
        // Handle the error according to your application's requirements
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // Handle the error according to your application's requirements
    }
  }
  const pathParts = pathname.split('/');
  const adminPortalIndex = pathParts.indexOf('admin-portal');
  const PortalIndex = pathParts.indexOf('portals');

  const idIndex = adminPortalIndex + 1;
  const categorieIndex = adminPortalIndex + 2;
  const subcategorieIndex = adminPortalIndex + 4;
  const UsercategorieIndex = PortalIndex + 1;
  const UsersubcategorieIndex = PortalIndex + 4;
  const adminId = pathParts[idIndex] || '';
  const categorie = pathParts[categorieIndex] || '';
  const subcategorie = pathParts[subcategorieIndex] || '';
  const Usercategorie = pathParts[UsercategorieIndex] || '';
  const Usersubcategorie = pathParts[UsersubcategorieIndex] || '';
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
    }}>
      <img
        alt={name}
        src={image}
        style={{
          width: '100%',
          height: '18rem',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        transition: 'background-color 0.3s ease',
      }}></div>
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
          }}>{name}</h2>
          {isAdmin && (
            <Dropdown
              classMenuItems="w-[130px]"
              label={
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2rem',
                  width: '2rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}>
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <Menu.Item onClick={handleUpdate}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#374151',
                  cursor: 'pointer',
                }}>
                  <Icon icon="heroicons-outline:pencil-alt" style={{ marginRight: '0.5rem' }} />
                  <span>Edit</span>
                </div>
              </Menu.Item>
              <Menu.Item onClick={handleDelete}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#DC2626',
                  cursor: 'pointer',
                }}>
                  <Icon icon="heroicons-outline:trash" style={{ marginRight: '0.5rem' }} />
                  <span>Delete</span>
                </div>
              </Menu.Item>
            </Dropdown>
          )}
        </div>
        <div style={{ marginTop: '1rem' }}>
          {isAdmin && (
            <button
              onClick={() => dispatch(openRegionModal({ open: true, CityID: name }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: 'white',
                backgroundColor: '#3B82F6',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
              }}
            >
              <Icon icon="heroicons-outline:plus" style={{ marginRight: '0.25rem' }} />
              Add Region
            </button>
          )}
          <div style={{
            maxHeight: '8rem',
            overflowY: 'auto',
            paddingRight: '0.5rem',
            marginRight: '-0.5rem',
            marginTop:'1.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
          }}>
            {regions.map((region, index) => (
              <a 
              href={isAdmin ?
                 `/admin-portal/${adminId}/${categorie}/sub-portal/${subcategorie}/cities/all-projects/${region.name}`
                 :`/portals/${Usercategorie}/sub-portal/${Usersubcategorie}/cities/all-projects/${region.name}`}
              key={index}
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: 'white',
                  padding: '0.5rem 0',
                  textDecoration: 'none',
                  borderBottom: index < regions.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                • {region.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCity;