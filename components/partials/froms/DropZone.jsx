import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ onSelectFiles }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      // Call the onSelectFiles function with the selected files
      onSelectFiles(acceptedFiles);
    },
  });

  return (
    <div className=" w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] flex flex-col justify-center items-center">
      <div  {...getRootProps({ className: "dropzone" })}>
        <input className="hidden" {...getInputProps()} />
        {files.length === 0 ? (
           <div className=" w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] flex flex-col justify-center items-center" {...getRootProps({ className: "dropzone" })}>
           <input className="hidden" {...getInputProps()} />
           <img
             src="/assets/images/svg/upload.svg"
             alt=""
             className="mx-auto mb-4"
           />
           {isDragAccept ? (
             <p className="text-sm text-slate-500 dark:text-slate-300 ">
               Drop the files here ...
             </p>
           ) : (
             <p className="text-sm text-slate-500 text-center dark:text-slate-300 f">
               Drop files here or click to upload.
             </p>
           )}
         </div>
        ) : (
          <div>
    
            <ul>
              {files.map((file,i) => (
              <div key={i}  className="mb-4 flex">
              <div className="h-[100px] w-[100px] mx-auto mt-6 rounded-md ">
                <img
                  src={file.preview}
                  alt=""
                  className=" object-contain h-full w-full block rounded-md"
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
              </div>
            </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;
