import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const AddEditCourseModal = ({
  isOpen,
  onClose,
  mode = "add",
  existingCourse = null,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    fees: "",
    duration: "",
    id:''
  });

  useEffect(() => {
    if (mode === "edit" && existingCourse) {
      setFormData({
        name: existingCourse.name || "",
        shortName: existingCourse.shortName || "",
        fees: existingCourse.fees || "",
        duration: existingCourse.duration || "",
        id: existingCourse._id || "",
      });
    } else {
      setFormData({
        name: "",
        shortName: "",
        fees: "",
        duration: "",
      });
    }
  }, [mode, existingCourse, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      fees: Number(formData.fees), // ensure number
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">
              {mode === "add" ? "Add New Course" : "Edit Course"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "add"
                ? "Create a new course"
                : "Update course details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="WEB DEVELOPMENT"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Short Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Short Name
            </label>
            <input
              type="text"
              name="shortName"
              placeholder="MERN"
              value={formData.shortName}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Fees & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fees <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  name="fees"
                  placeholder="5000"
                  value={formData.fees}
                  onChange={handleChange}
                  required
                  min="0"
                  onWheel={(e) => e.target.blur()}
                  className="w-full number-input pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (in months)
              </label>
              <input
                type="text"
                name="duration"
                placeholder="3"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg"
            >
              {isLoading
                ? "Saving..."
                : mode === "add"
                ? "Add Course"
                : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCourseModal;
