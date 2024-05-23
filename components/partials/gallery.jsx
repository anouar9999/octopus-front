"use client";

import React, { useState } from "react";
import ImageModal from "./ImageModal";
import { isAdmin } from "@/constant/data";

const Gallery = () => {
  const [modalSrc, setModalSrc] = useState(null);

  const openFullScreen = (src) => {
    setModalSrc(src);
  };

  const closeFullScreen = () => {
    setModalSrc(null);
  };
  return (
    <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
    {
      isAdmin &&   <div class=" z-10 top-0  flex bg-black bg-opacity-60">
      <div class="extraOutline p-4 bg-white bg-whtie m-auto rounded-lg">
        <div
          class="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg"
          style={{ width: "350px" }}
        >
          <svg
            class="text-indigo-500 w-24 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div class="input_field flex flex-col w-max mx-auto text-center">
            <label>
              <input
                class="text-sm cursor-pointer w-11 hidden"
                type="file"
                multiple
              />
              <div class="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">
                Select
              </div>
            </label>

            <div class="title text-indigo-500 uppercase">
              or drop files here
            </div>
          </div>
        </div>
      </div>
    </div>
    }

      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029344.png"
          alt="Gallery image"
          onClick={() =>
            openFullScreen("https://pagedone.io/asset/uploads/1688029344.png")
          }
        />
      </div>
      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029370.png"
          alt="Gallery image"
        />
      </div>
      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029384.png"
          alt="Gallery image"
          onClick={() =>
            openFullScreen("https://pagedone.io/asset/uploads/1688029384.png")
          }
        />
        {modalSrc && <ImageModal src={modalSrc} onClose={closeFullScreen} />}
      </div>
      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029394.png"
          alt="Gallery image"
        />{" "}
        {modalSrc && <ImageModal src={modalSrc} onClose={closeFullScreen} />}
      </div>
      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029408.png"
          alt="Gallery image"
        />
      </div>
      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029424.jpg"
          alt="Gallery image"
        />
      </div>
      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029434.png"
          alt="Gallery image"
        />
      </div>
      <div>
        <img
          class="h-auto max-w-full rounded-lg"
          src="https://pagedone.io/asset/uploads/1688029447.jpg"
          alt="Gallery image"
        />
      </div>
    </div>
  );
};
export default Gallery;
