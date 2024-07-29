import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { openCommentModal, openInfoModal } from "@/components/partials/app/portals/store";
import { toggleUploadImageModal } from "./app/projects/store";
import { FileText, FileImage, FileArchive, FileSpreadsheet, File, Upload, Image, Trash2 } from 'lucide-react';
import InfoImage from "./app/portals/InfoImage";
import Reperage from "./app/portals/Reperage";
import UploadImages from "./app/projects/uploadImages";

const ImageModal = ({ src, onClose }) => (
  <div className="fixed inset-0 z-[9999999] bg-black bg-opacity-75 backdrop-blur-md flex items-center justify-center" onClick={onClose}>
    <div className="relative max-w-[90vw] max-h-[90vh] p-8 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-gradient-to-br from-black-500 via-grey-500 to-white-500 opacity-75 blur-2xl"></div>
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md"></div>
      <div className="relative">
        <img src={`${process.env.NEXT_PUBLIC_API_URL}/${src}`} alt="Full screen" className="max-w-full max-h-[calc(90vh-4rem)] object-contain rounded-lg shadow-2xl" />
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300 z-10" aria-label="Close modal">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
);

const ImageWithIcons = ({ src, isAdmin, onDelete, onComment, onInfo, onClick }) => (
  <div className="relative group w-full pb-[56.25%]">
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      <img src={src} alt="Gallery image" className="w-full h-full object-cover" onClick={onClick} />
    </div>
    <button onClick={onClick} className="absolute top-2 left-2 p-2 rounded-full text-white bg-black-600 hover:bg-opacity-75 focus:outline-none transition-all duration-300" aria-label="Full screen">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
      </svg>
    </button>
    <div className="absolute top-2 right-2 flex flex-col space-y-2">
      <button onClick={onComment} className="p-2 rounded-full text-white bg-blue-500 focus:outline-none transition-all duration-300">
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </button>
      <button onClick={onInfo} className="p-2 rounded-full text-white bg-green-500 focus:outline-none transition-all duration-300">
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>
      {isAdmin && (
        <button onClick={onDelete} className="p-2 rounded-full text-white bg-red-500 focus:outline-none transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      )}
    </div>
  </div>
);

const EmptyState = ({ type, isAdmin, onUpload }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    {type === 'image' ? <Image className="w-16 h-16 text-gray-400 mb-4" /> : <File className="w-16 h-16 text-gray-400 mb-4" />}
    <p className="text-lg font-semibold text-gray-700 mb-2">No {type === 'image' ? 'images' : 'files'} uploaded yet</p>
    <p className="text-sm text-gray-500 text-center mb-4">
      {isAdmin
        ? `Upload ${type === 'image' ? 'an image' : 'a file'} to get started`
        : `No ${type === 'image' ? 'images' : 'files'} have been added to this project yet`}
    </p>
  
  </div>
);

const Gallery = ({ projectId, StageName }) => {
  const [modalSrc, setModalSrc] = useState(null);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const isAdmin = userData?.user?.is_admin || false;

  useEffect(() => {
    fetchProjectImages();
    fetchProjectFiles();
  }, []);

  const fetchProjectImages = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/${StageName}/images/`);
      if (response.status === 200) {
        setImages(response.data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images");
    }
  };

  const fetchProjectFiles = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/${StageName}/files/`);
      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to fetch files");
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/${StageName}/images/${imageId}/delete/`);
      if (response.status === 204) {
        toast.success("Image deleted successfully");
        fetchProjectImages();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/${StageName}/files/${fileId}/delete/`);
      toast.success('File deleted successfully');
      fetchProjectFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (allowedImageTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a document file, not an image.');
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/${StageName}/upload_file/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 201) {
        toast.success("File uploaded successfully");
        fetchProjectFiles();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };

  const getFileName = (file) => {
    if (file.name) return file.name;
    const pathParts = file.file.split('/');
    return pathParts[pathParts.length - 1];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="w-8 h-8 text-green-500" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="w-8 h-8 text-yellow-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-8 h-8 text-green-700" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Project Images</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {isAdmin && (
          <div className="relative group">
            <a onClick={() => dispatch(toggleUploadImageModal(true))}>
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 group-hover:bg-gray-300">
                <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                  <svg className="w-12 h-28 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span className="mt-2 mb-4 text-sm font-medium text-gray-500 group-hover:text-gray-600">Upload Image</span>
                </label>
              </div>
            </a>
          </div>
        )}
        {images.length > 0 ? (
          images.map((image, index) => (
            <ImageWithIcons
              key={index}
              src={`${process.env.NEXT_PUBLIC_API_URL}${image.image}`}
              isAdmin={isAdmin}
              onComment={() => dispatch(openCommentModal({ open: true, imageId: image.id }))}
              onDelete={() => handleImageDelete(image.id)}
              onInfo={() => dispatch(openInfoModal({ open: true, image: image.image, desc: image.info }))}
              onClick={() => setModalSrc(image.image)}
            />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              type="image"
              isAdmin={isAdmin}
              onUpload={() => dispatch(toggleUploadImageModal(true))}
            />
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">Project Files</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isAdmin && (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border-2 border-dashed border-gray-300">
            <label className="cursor-pointer flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="text-sm font-medium text-gray-700 text-center mb-2">Upload File</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {files.length > 0 ? (
          files.map((file, i) => {
            const fileName = getFileName(file);
            return (
              <div key={i} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
                <button
                  onClick={() => handleFileDelete(file.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                  aria-label="Delete file"
                >
                  <Trash2 size={18} />
                </button>
                <div className="mb-3">
                  {getFileIcon(fileName)}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center line-clamp-1">
                  {fileName}
                </span>
                <span className="text-xs text-gray-500 mt-1 mb-2">
                  {new Date(file.uploaded_at).toLocaleDateString()}
                </span>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}${file.file}`}
                  download
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-colors duration-200"
                >
                  Download
                </a>
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <EmptyState
              type="file"
              isAdmin={isAdmin}
              onUpload={() => document.querySelector('input[type="file"]').click()}
            />
          </div>
        )}
      </div>

      {modalSrc && <ImageModal src={modalSrc} onClose={() => setModalSrc(null)} />}
      <InfoImage />
      <Reperage projectId={projectId} stageId={StageName} />
      <UploadImages projectID={projectId} stageName={StageName} />
    </div>
  );
};

export default Gallery;