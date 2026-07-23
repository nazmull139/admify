import React, { useState } from "react";
import { FaAward, FaBars, FaChevronDown, FaFileSignature, FaGraduationCap, FaSignOutAlt, FaTimes, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useAuth, ROLE_HOME } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // AI-powered features live inside the Student dashboard — for guests these
  // links route to Register (create an account first); for logged-in students
  // they jump straight to the relevant dashboard tab.
  const isStudent = user?.role === 'Student';
  const studyServices = [
    { name: "AI University Match", icon: <FaGraduationCap className="text-indigo-500" />, tab: "AI Recommendation" },
    { name: "AI SOP Generator", icon: <FaFileSignature className="text-indigo-500" />, tab: "AI SOP Generator" },
    { name: "AI LOR Generator", icon: <FaFileSignature className="text-indigo-500" />, tab: "AI LOR Generator" },
    { name: "Scholarship Finder", icon: <FaAward className="text-indigo-500" />, tab: "AI Recommendation" },
    { name: "Expert Consultancy", icon: <FaUserTie className="text-indigo-500" />, tab: "Assigned Agent" },
  ];

  const serviceHref = (tab) => (isStudent ? `/studentdashboard?tab=${encodeURIComponent(tab)}` : '/register');

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const dashboardHref = user ? (ROLE_HOME[user.role] || '/') : '/login';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <Link to="/" className="text-2xl font-black tracking-tight text-indigo-600 flex items-center gap-2">
          <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-xl text-base font-black">AI</span>
          <span>StudyAI</span>
        </Link>

        {/* ডেক্সটপ মেনু */}
        <ul className="hidden md:flex items-center space-x-8 font-semibold text-gray-600">
          <li><Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
          <li><Link to="/universities" className="hover:text-indigo-600 transition-colors">Universities</Link></li>

          <li className="relative group cursor-pointer py-2">
            <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              Services <FaChevronDown className="text-[10px] group-hover:rotate-180 transition-transform duration-300" />
            </div>

            <ul className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 space-y-1">
              {studyServices.map((service, index) => (
                <li key={index}>
                  <Link to={serviceHref(service.tab)} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50/50 rounded-xl transition-colors text-sm text-gray-700 font-medium">
                    {service.icon}
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link></li>
          <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
          <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
        </ul>

        {/* ডেক্সটপ অ্যাকশন বাটনসমূহ */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to={dashboardHref} className="px-5 py-2.5 font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
                {user?.name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button onClick={handleLogout} className="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                <FaSignOutAlt className="text-sm" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2.5 font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all transform hover:-translate-y-0.5">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* মোবাইল মেনু টগল বাটন */}
        <button
          className="md:hidden text-gray-600 text-xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* মোবাইল রেসপনসিভ মেনু */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-gray-50/80 backdrop-blur-md rounded-2xl p-5 border border-gray-100 space-y-4 text-gray-700 font-semibold shadow-inner">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-indigo-600 py-1">Home</Link>
          <Link to="/universities" onClick={() => setMenuOpen(false)} className="block hover:text-indigo-600 py-1">Universities</Link>

          <div className="border-y border-gray-200/60 py-2">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center justify-between w-full py-1 text-gray-700"
            >
              <span>Services</span>
              <FaChevronDown className={`text-xs transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>

            {servicesOpen && (
              <div className="pl-3 mt-3 space-y-3">
                {studyServices.map((service, index) => (
                  <Link
                    key={index}
                    to={serviceHref(service.tab)}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-sm text-gray-600 font-medium py-1"
                  >
                    {service.icon}
                    <span>{service.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" onClick={() => setMenuOpen(false)} className="block hover:text-indigo-600 py-1">About</Link>
          <Link to="/pricing" onClick={() => setMenuOpen(false)} className="block hover:text-indigo-600 py-1">Pricing</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-indigo-600 py-1">Contact</Link>

          <div className="flex flex-col gap-2.5 pt-2">
            {isAuthenticated ? (
              <>
                <Link to={dashboardHref} onClick={() => setMenuOpen(false)} className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-center text-sm font-bold shadow-sm">
                  {user?.name?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="px-4 py-3 bg-slate-900 text-white rounded-xl text-center text-sm font-bold shadow-md flex items-center justify-center gap-2">
                  <FaSignOutAlt /> Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-center text-sm font-bold shadow-sm">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-center text-sm font-bold shadow-md shadow-indigo-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
