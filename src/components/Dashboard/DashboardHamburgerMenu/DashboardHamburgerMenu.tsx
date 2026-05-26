import { Link, useNavigate } from "react-router-dom";
import { IMAGES } from "../../../assets";
import { useEffect, useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../../../redux/Features/Auth/authSlice";
import RoleBasedNavlinks from "../Sidebar/RoleBasedNavlinks/RoleBasedNavlinks";
import {
  FiArrowRight,
  FiHelpCircle,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";
import { RiMenu3Line } from "react-icons/ri";

const DashboardHamburgerMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const closestDropdown = target.closest(".hamburgerMenu");
      if (isHamburgerOpen && closestDropdown === null) {
        setIsHamburgerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isHamburgerOpen]);

  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="relative hamburgerMenu flex xl:hidden">
      <button
        onClick={toggleHamburgerMenu}
        className="bg-white w-10 h-9 border border-primary-10 cursor-pointer rounded-lg flex items-center justify-center"
      >
        <RiMenu3Line className="text-2xl" />
      </button>

      {/* Background Overlay */}
      <div
        onClick={toggleHamburgerMenu}
        className={`fixed inset-0 bg-black z-[9998] transition-opacity duration-300 ${
          isHamburgerOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Side Menu - Opens from Right */}
      <div
        className={`fixed inset-y-0 right-0 z-[9999] bg-white w-[280px] shadow-2xl overflow-y-auto transition-all duration-300 transform flex flex-col gap-4 items-start justify-between ${
          isHamburgerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with Close Button */}
        <div className="pt-4 w-full">
          <div className="flex items-center justify-between px-4 mb-3 w-full">
            <Link to="/dashboard/admin/home">
              <img src={IMAGES.logo} alt="Logo" className="w-32 mx-auto" />
            </Link>
            <button onClick={toggleHamburgerMenu}>
              <FiX size={20} className="text-gray-600" />
            </button>
          </div>
          <hr className="border border-neutral-50/20" />

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar-sidebar p-5">
            <RoleBasedNavlinks  setIsHamburgerOpen={setIsHamburgerOpen}/>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-5 w-full border-t border-gray-100">
          {/* Help Card */}
          <div className="mb-4">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100 shadow-sm">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary-10/5 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-primary-10/5 rounded-full -ml-6 -mb-6"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-primary-10/10 p-1.5 rounded-lg">
                    <FiHelpCircle className="text-primary-10" size={18} />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Got any confusion?
                  </h4>
                </div>

                <p className="text-xs text-gray-600 mb-3 leading-relaxed text-center">
                  Have questions or need assistance? Our support team is here to
                  help you.
                </p>

                <Link
                  to="/dashboard/raise-query"
                  onClick={toggleHamburgerMenu}
                  className="w-full flex items-center justify-center gap-2 bg-primary-10 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-20 transition-all duration-300 group"
                >
                  <FiMessageSquare size={16} />
                  <span>Reach to Us</span>
                  <FiArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 border border-neutral-20/30 rounded-2xl py-2 text-primary-10 w-full hover:bg-red-50 hover:border-red-200 transition-all duration-300"
          >
            <TbLogout2 className="text-xl" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHamburgerMenu;
