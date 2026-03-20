import React, { useContext } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  // 🔥 Handle click
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  // 🔥 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  // ✅ Derived data (NO useState / useEffect)
  const sideMenuData =
    user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;
    console.log(sideMenuData);
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px]">

      {/* USER INFO */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImgUrl || ""}
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">
          {user?.email || ""}
        </p>
      </div>

      {/* MENU ITEMS */}
      <div>
        {sideMenuData.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-4 text-[15px] ${
                activeMenu === item.label
                  ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4"
                  : ""
              } py-3 px-6 mb-3 cursor-pointer`}
              onClick={() => handleClick(item.path)}
            >
              <Icon className="text-xl" />
              {item.label}
              
            </button>
           
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;