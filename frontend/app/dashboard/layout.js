import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="col">
        <Sidebar />
      </div>
      <div className="col p-5">{children}</div>
    </div>
  );
};

export default Layout;
