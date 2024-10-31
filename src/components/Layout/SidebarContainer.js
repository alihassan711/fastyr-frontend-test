import React from "react";
import Sidebar from "../Sidebar/Sidebar";

const SidebarContainer = () => {
  return (
    <aside className="hidden lg:block w-64 bg-gray-900 text-white">
      <Sidebar />
    </aside>
  );
};

export default SidebarContainer;
