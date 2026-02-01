import { useState } from "react";
import { apiClient } from "../../config/api";
import { useMutation } from "@tanstack/react-query";
import { userApiRoutes } from "../../config/apiRoutes";
import { useNavigate } from "react-router-dom";

const studentLoginRequest = async (data) => {
  try {
    const response = await apiClient.post(userApiRoutes.STUDENT_LOGIN, data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export default function StudentLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["studentLogin"],
    mutationFn: studentLoginRequest,
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("studentAuthFlag", "true");
        localStorage.setItem("role", "student");
        localStorage.setItem("studentToken", data.studentToken);
        localStorage.setItem("studentId", data.student._id); // Store ID for fetching profile
        navigate("/student/dashboard");
        alert("Student Login successful!");
      } else {
        alert("Login failed");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong during login");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    
    mutate(form);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 flex flex-col lg:flex-row">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-teal-600 to-emerald-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white"></div>
           <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-8 mx-auto backdrop-blur-sm">
            <span className="text-4xl">👨‍🎓</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Quadros Student Portal
          </h1>
          
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Check your fees, academic progress, and more.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
           <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Student Login
              </h2>
              <p className="text-gray-600">
                Enter your email and use your Student ID as password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                  placeholder="student@example.com"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Password (Student ID)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                    placeholder="Enter your Student ID"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all duration-300 font-semibold text-lg shadow-lg"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
