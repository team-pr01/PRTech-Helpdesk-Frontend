import { Outlet } from "react-router-dom";
import Sidebar from "./../components/Dashboard/Sidebar/Sidebar";
import FloatingWhatsApp from "../components/FloatingWhatsApp/FloatingWhatsApp";
import { IMAGES } from "../assets";
import DashboardHamburgerMenu from "../components/Dashboard/DashboardHamburgerMenu/DashboardHamburgerMenu";

const DashboardLayout = () => {
  return (
    <div className="flex w-full h-screen bg-[#F2F5FC] overflow-x-hidden">
      <Sidebar />

      <div className="flex flex-col w-full min-w-0">
        <div className="md:hidden flex items-center justify-between py-4 md:pt-5 px-4 md:px-5">
          <img src={IMAGES.logo} alt="" className="w-28" />
          <DashboardHamburgerMenu/>
        </div>
        <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-5`}>
          <Outlet />
        </div>
      </div>
      <FloatingWhatsApp />
    </div>
  );
};

export default DashboardLayout;
