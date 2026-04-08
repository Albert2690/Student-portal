import React from 'react';

function StaffsList() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staffs</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add Staff
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500 text-center py-8">Staff members will appear here</p>
      </div>
    </div>
  );
}

export default StaffsList;
