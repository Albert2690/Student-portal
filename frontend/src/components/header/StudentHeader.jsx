import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("studentAuthFlag");
    localStorage.removeItem("role");
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentId");
    navigate("/student/login");
  };

  return (
    <div className="relative">
      <header className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">👨‍🎓</span>
              </div>
              <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">
                Quadros Student Portal
              </h1>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
               {/* Add links if needed, e.g. Dashboard */}
              <button
                onClick={handleLogout}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200"
              >
                Logout
              </button>
            </nav>

             {/* Mobile menu button */}
             <button
              className="lg:hidden text-white bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 backdrop-blur-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              Menu
            </button>
          </div>
        </div>
      </header>
       {/* Mobile Logout */}
       {isOpen && (
        <div className="lg:hidden bg-white shadow-md p-4 absolute w-full z-50">
           <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 font-semibold py-2"
              >
                Logout
              </button>
        </div>
       )}
    </div>
  );
}
