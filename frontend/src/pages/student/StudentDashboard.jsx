import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../config/api';
import { userApiRoutes } from '../../config/apiRoutes';

const fetchStudentProfile = async () => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) throw new Error("No student ID found");
    // Ensure the route is correct: /api/student/profile/:studentId
    const response = await apiClient.get(`${userApiRoutes.GET_STUDENT_PROFILE}/${studentId}`);
    return response.data;
};

export default function StudentDashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['studentProfile'],
        queryFn: fetchStudentProfile,
    });

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error loading profile</div>;

    const student = data?.studentDetails;
    if (!student) return <div>No student data found</div>;

    const totalFees = student.courseFeesOriginal || 0;
    const discount = student.discount || 0;
    const netPayable = Math.max(0, totalFees - discount);
    
    const totalPaid = student.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const pendingFees = Math.max(0, netPayable - totalPaid);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome, {student.firstName}!</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Course Fee</p>
                    <p className="text-2xl font-bold text-gray-800">₹{netPayable.toLocaleString()}</p>
                     {discount > 0 && <span className="text-xs text-green-600">(Inc. ₹{discount} discount)</span>}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Pending Fees</p>
                    <p className="text-2xl font-bold text-red-500">₹{pendingFees.toLocaleString()}</p>
                </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Course Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                     <div>
                        <p className="text-sm text-gray-500">Course Name</p>
                        <p className="font-medium">{student.course}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{student.department}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium">{student.year}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500">Admission No</p>
                        <p className="font-medium">{student.admissionNo}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500">Joining Year</p>
                        <p className="font-medium">{student.joiningYear}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {student.status}
                        </span>
                     </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Month</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {student.payments && student.payments.length > 0 ? (
                                student.payments.map((payment, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(payment.paidOn).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {payment.month}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-green-600 font-bold">
                                            ₹{payment.amount?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
