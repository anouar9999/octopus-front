import React from 'react';
import {
    openCommentModal,openUploadModal
  } from "@/components/partials/app/portals/store";
import { useDispatch } from 'react-redux';
import Reperage from '../../app/portals/Reperage';
import InfoImage from '../../app/portals/InfoImage';
const ImageWithIcons = ({ src, openFullScreen, handleImageDelete, isAdmin }) => {
    const dispatch = useDispatch();

  return (
    <div className="relative w-80">
      <div className="relative w-full h-80">
        <img
          className="object-cover w-full h-full rounded-lg"
          src={src}
          alt="Gallery image"
          onClick={() => openFullScreen(src)}
        />
       {isAdmin && (
        <div className="absolute top-0 right-0 flex flex-col space-y-1 p-2">
          <button
            onClick={() => handleImageDelete(src.id)}
            className="bg-red-500 text-white p-1 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
          <button
            onClick={() => dispatch(openCommentModal(true))}
            className="bg-blue-500 text-white p-1 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.65 0 8.25-3.6 8.25-8.25S16.65 3.75 12 3.75 3.75 7.35 3.75 12 7.35 20.25 12 20.25z"
              />
            </svg>
          </button>
          <button
            onClick={() => dispatch(openUploadModal(true))}
            className="bg-green-500 text-white p-1 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5l-6 6M9 10.5l6 6"
              />
            </svg>
          </button>
        </div>
      )}
      <Reperage/>
      <InfoImage />
      
      </div>
    </div>
  );
};

export default ImageWithIcons;
