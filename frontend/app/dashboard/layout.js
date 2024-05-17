import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="flex flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-col px-5 py-1 w-full">{children}</div>
    </div>
  );
};

export default Layout;
