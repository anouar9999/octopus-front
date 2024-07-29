import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openInfoModal } from "@/components/partials/app/portals/store";
import Modal from "@/components/ui/Modal";
import RepeaterInfo from "../../froms/RepeaterInfo";

const InfoImage = ({ isAdmin }) => {
  const { InfoModel, InfoImage,descriptionImg } = useSelector((state) => state.portals);
  const dispatch = useDispatch();

  return (
    <Modal
      title="Image Information"
      labelClassName="btn-outline-dark"
      activeModal={InfoModel}
      onClose={() => dispatch(openInfoModal({open:false}))}
    >
      <div className="space-y-6 p-4">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${InfoImage}`}
          className="w-full h-auto rounded-lg object-cover"
          alt="Gallery image"
        />


        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            Info
          </h2>

          {isAdmin ? (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter description here..."
              rows="5"
            />
          ) : (
            <div className="text-gray-700 p-3 bg-gray-50 border border-gray-200 rounded-lg">
{descriptionImg}            </div>
          )}

          {isAdmin && (
            <div className="flex justify-end">
              <button className=" w-full btn btn-dark ">
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InfoImage;