import { Link, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../../../redux/Features/Auth/authSlice";
import { IMAGES } from "../../../assets";
import Cookies from "js-cookie";
import RoleBasedNavlinks from "./RoleBasedNavlinks/RoleBasedNavlinks";
import { FiArrowRight, FiHelpCircle, FiMessageSquare } from "react-icons/fi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="top-0 left-0 hidden xl:block">
      <div className="w-[230px] 2xl:w-[270px] bg-white font-Nunito flex flex-col justify-between h-full gap-5">
       <div className="pt-4">
         <Link
          to="/dashboard/admin/home"
          className=""
        >
          <img src={IMAGES.logo} alt="Logo" className="w-39 mx-auto" />
        </Link>
        <hr className="border border-neutral-50/20 mt-3" />

        <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar-sidebar p-5">
            <RoleBasedNavlinks />
          </div>
       </div>
        <div className="p-5">
          {/* Help Card */}
          <div className="mb-4">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-2 border border-blue-100 shadow-sm">
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
                  Have questions or need assistance? Our support team is here to help you.
                </p>
                
                <button
                  onClick={() => navigate("/dashboard/queries")}
                  className="w-full flex items-center justify-center gap-2 bg-primary-10 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-20 transition-all duration-300 group"
                >
                  <FiMessageSquare size={16} />
                  <span>Reach to Us</span>
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 border border-neutral-20/30 rounded-2xl py-2 text-primary-10 w-full`}
          >
            <TbLogout2 className="text-xl" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
