import React from "react";

const Modal = ({ isVisible, onClose, title, children }) => {
  if (!isVisible) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="w-[600px] flex flex-col">
          <div className="flex justify-between bg-cyan-500 py-2">
            <span className="text-white text-lg pl-2 font-bold">{title}</span>
            <span
              className="text-white text-xl place-self-end pr-1"
              onClick={onClose}
            >
              X
            </span>
          </div>

          <div className="bg-white p-2 rounded">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;