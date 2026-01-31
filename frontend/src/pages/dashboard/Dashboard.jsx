import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Hash, TrendingUp, Clock, DollarSign } from "lucide-react";
import { apiClient } from "../../config/api";
import { userApiRoutes } from "../../config/apiRoutes";

const fetchStats = async () => {
    try {
        const response = await apiClient.get(userApiRoutes.DASHBOARD_STATS);
        return response.data?.stats;
    } catch (err) {
        console.log("fetchStats error:", err);
        return null;
    }
};

const Dashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: fetchStats,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-xl text-gray-500 font-medium animate-pulse">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                        <p className="text-gray-500 mt-1">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                            Academic Year 2024-25
                        </div>
                        <span className="text-sm text-gray-400">|</span>
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Students Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <Users size={24} />
                                </div>
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full flex items-center gap-1">
                                    <TrendingUp size={12} /> +12%
                                </span>
                            </div>
                            <h3 className="text-4xl font-bold text-gray-800 mb-1">{stats?.totalStudents || 0}</h3>
                            <p className="text-gray-500 font-medium">Total Students</p>
                        </div>
                    </div>

                    {/* Total Courses Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                    <BookOpen size={24} />
                                </div>
                                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                                    Active
                                </span>
                            </div>
                            <h3 className="text-4xl font-bold text-gray-800 mb-1">{stats?.totalCourses || 0}</h3>
                            <p className="text-gray-500 font-medium">Total Courses</p>
                        </div>
                    </div>

                    {/* Fees Collected Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                    <DollarSign size={24} />
                                </div>
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                    Revenue
                                </span>
                            </div>
                            <h3 className="text-4xl font-bold text-gray-800 mb-1">
                                ₹{(stats?.totalFeesCollected || 0).toLocaleString()}
                            </h3>
                            <p className="text-gray-500 font-medium">Total Fees Collected</p>
                        </div>
                    </div>
                </div>

                {/* Second Row: Quick Actions or Info (Placeholder for aesthetics) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center text-center space-y-4">
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-full">
                            <Clock size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                            <p className="text-gray-500 text-sm">Common tasks you perform</p>
                        </div>
                        <div className="flex gap-3 w-full justify-center">
                            <button onClick={() => window.location.href='/create-student'} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                Add Student
                            </button>
                            <button onClick={() => window.location.href='/courses'} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                                Manage Courses
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Pending Fees</h3>
                            <p className="text-indigo-100 mb-4 max-w-sm">
                                Total outstanding amount to be collected from students.
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={32} className="text-white bg-white/20 p-1.5 rounded-lg" />
                                <span className="text-3xl font-bold text-white">
                                    ₹{(stats?.totalPendingFees || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-4 opacity-90">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                <span className="text-sm font-medium text-indigo-50">Pending Collection</span>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
