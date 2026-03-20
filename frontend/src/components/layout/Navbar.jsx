import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex items-center justify-between gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        {/* Hamburger Button (mobile only) */}
        <button
          className="block lg:hidden text-black"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Title */}
        <h2 className="text-lg font-medium text-black">
          Task Mangement
        </h2>
      </div>

      {/* RIGHT SECTION (optional future items) */}
      <div>
        {/* You can add profile/logout here */}
      </div>

      {/* MOBILE SIDEMENU */}
      {openSideMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setOpenSideMenu(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-[61px] left-0 w-64 h-full bg-white shadow-lg z-50">
            <SideMenu activeMenu={activeMenu} />
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;