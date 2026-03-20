import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user, loading } = useContext(UserContext);
  
    if (loading) return <p>Loading...</p>; // 👈 important
  
    if (!user) return null; // redirect already ho raha hai
  
    return (
      <div>
        <Navbar activeMenu={activeMenu} />
  
        <div className="flex h-screen ">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
  
          <div className="flex-1 overflow-y-auto mx-5">{children}</div>
        </div>
      </div>
    );
  };

  export default DashboardLayout