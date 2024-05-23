import React from 'react';

const ImageModal = ({ src, onClose }) => {
  
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-90 flex justify-center items-center" onClick={onClose}>
      <img src={src} className="max-h-screen max-w-screen cursor-pointer" style={{ cursor: 'zoom-out' }} />
    </div>
  );
};

export default ImageModal;
