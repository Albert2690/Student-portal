import React, { useState, useEffect } from "react";
import { CLIENTROUTES } from "../../../../backend/routes/clientRoutes";

function Header() {
  const [isOpen, setIsOpen] = useState(false);



const MENU_ITEMS = [
  {
    name: "Dashboard",
    path: CLIENTROUTES.DASHBOARD,
    icon: "📊",
    description: "Overview & Analytics",
  },
  {
    name: "Students",
    path: CLIENTROUTES.LIST_STUDENTS, // make sure this exists
    icon: "👥",
    description: "Manage Students",
  },
  {
    name: "Courses",
    path: CLIENTROUTES.COURSES,
    icon: "📚",
    description: "Course Management",
  },
  {
    name: "Fees",
    path: CLIENTROUTES.FEES, // optional / future
    icon: "⚙️",
    description: "Configuration",
  },
];


  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            {/* Logo/Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">
                Student Portal
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden
         ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎓</span>
              </div>
              <h2 className="text-white font-semibold text-lg">Menu</h2>
            </div>
            <button
              className="text-white bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 transition-all duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="p-6">
          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-4 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white text-xl">{item.icon}</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-600">
                    {item.description}
                  </p>
                </div>

                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">👤</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">John Doe</h4>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay (when sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Header;
