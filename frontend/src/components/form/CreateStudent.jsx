import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  DollarSign,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../config/api";
import { userApiRoutes } from "../../config/apiRoutes";

const handleCreate = async ({studentDetails}) => {
  try {
    const response = await apiClient.post(
      userApiRoutes.CREATE_STUDENT,
      studentDetails
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const CreateEditStudent = ({ mode, existingStudent = null }) => {

  console.log("mode:", mode);
console.log("existingStudent:", existingStudent);
  // Initialize form data
  const [formData, setFormData] = useState(
    existingStudent || {
      // Personal Information
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      district: "",

      // Contact Information
      email: "",
      phone: "",
      pincode: "",
      address: "",
      city: "",
      state: "",

      // Qualification Details
      lastInstitution: "",
      yearOfPassout: "",
      institutionAddress: "",
      highestQualification: "",

      // Guardian Details
      guardianName: "",
      guardianAddress: "",
      guardianMobile: "",

      // Academic Information
      admissionNo: "",
      joiningYear: new Date().getFullYear().toString(),
      department: "",
      course: "",
      courseId: "", // Track ID for reference
      year: "",
      status: "Active",

      // Financial Information
      courseFeesOriginal: "",
      discount: 0,
      payments: [], // Store installment payments
    }
  );

  const handleUpdateStudent = async ({ studentId, studentDetails }) => {
    const res = await apiClient.put(
      `${userApiRoutes.UPDATE_STUDENT}/${studentId}`,
      studentDetails
    );
    return res.data;
  };

  const { mutate: mutateCreate } = useMutation({
    mutationKey: ["create-student"],
    mutationFn: handleCreate,
    onSuccess: () => alert("Student created successfully!"),
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationKey: ["update-student"],
    mutationFn: handleUpdateStudent,
    onSuccess: () => alert("Student updated successfully!"),
  });

  // Fetch Courses
  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await apiClient.get(userApiRoutes.LIST_COURSES);
      return res.data?.courses || [];
    },
  });

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("personal");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "course") {
      // Find selected course
      const selectedCourse = coursesData?.find(c => c.name === value);
      
      if (selectedCourse) {
        // Parse duration (e.g. "3 Months" -> 3)
        const durationMatch = selectedCourse.duration?.match(/(\d+)/);
        const months = durationMatch ? parseInt(durationMatch[1]) : 0;
        
        // Generate payment installments if not editing or if payments are empty
        // Only override payments if it's a new course selection that warrants reset, 
        // but for edit mode usually we want to keep history. 
        // For simplicity, if we are editing, we might likely NOT want to wipe payments just by clicking dropdown unless necessary.
        // But the original logic did this, so let's stick to it but be careful.
        
        let newPayments = [];
        if (mode === 'create' || !formData.payments || formData.payments.length === 0) {
             newPayments = Array.from({ length: months }, (_, i) => ({
              month: `Month ${i + 1}`,
              amount: "",
              paidOn: new Date().toISOString().split('T')[0],
              isPaid: false
            }));
        } else {
            // Keep existing payments
             newPayments = formData.payments;
        }

        setFormData(prev => ({
          ...prev,
          course: value,
          courseId: selectedCourse._id,
          courseFeesOriginal: selectedCourse.fees,
          payments: newPayments
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name.startsWith("payment_")) {
        // Handle payment input changes (e.g. payment_0_amount)
        const [_, index, field] = name.split("_");
        const idx = parseInt(index);
        
        setFormData(prev => {
            const updatedPayments = [...prev.payments];
            updatedPayments[idx] = {
                ...updatedPayments[idx],
                [field]: value
            };
            return { ...prev, payments: updatedPayments };
        });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const calculateTotalAmount = () => {
    const original = parseFloat(formData.courseFeesOriginal) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return original - (original * discount) / 100;
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Information
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.district.trim()) newErrors.district = "District is required";

    // Contact Information
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    // Qualification Details
    if (!formData.lastInstitution.trim())
      newErrors.lastInstitution = "Last institution is required";
    if (!formData.yearOfPassout.trim())
      newErrors.yearOfPassout = "Year of passout is required";
    if (!formData.institutionAddress.trim())
      newErrors.institutionAddress = "Institution address is required";
    if (!formData.highestQualification)
      newErrors.highestQualification = "Highest qualification is required";

    // Guardian Details
    if (!formData.guardianName.trim())
      newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianAddress.trim())
      newErrors.guardianAddress = "Guardian address is required";
    if (!formData.guardianMobile.trim())
      newErrors.guardianMobile = "Guardian mobile is required";

    // Academic Information
    if (mode==='edit' && (!formData.admissionNo || !formData.admissionNo.trim()))
      newErrors.admissionNo = "Admission number is required";
    if (!formData.joiningYear)
      newErrors.joiningYear = "Joining year is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.course.trim()) newErrors.course = "Course is required";
    if (!formData.year) newErrors.year = "Year is required";

    // Financial Information
    if (!formData.courseFeesOriginal)
      newErrors.courseFeesOriginal = "Course fees is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('called', formData)
    if (validateForm()) {
      const totalAmount = calculateTotalAmount();
      
      // Sanitize payments
      const sanitizedPayments = formData.payments?.map(p => ({
          ...p,
          amount: p.amount === "" ? 0 : parseFloat(p.amount)
      })) || [];

      const studentData = {
        ...formData,
        totalAmountAfterDiscount: totalAmount,
        payments: sanitizedPayments
      };

      console.log("Student Data:", studentData);
      
      if (mode === 'create') {
        mutateCreate({ studentDetails: studentData });
      } else if (mode === 'edit' && existingStudent?._id) {
        mutateUpdate({ studentId: existingStudent?._id, studentDetails: studentData });
      }
      
      // Here you would typically send the data to your backend
    } else {
      // Scroll to first error
      console.log('error')
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "qualification", label: "Qualification", icon: GraduationCap },
    { id: "guardian", label: "Guardian", icon: Users },
    { id: "academic", label: "Academic", icon: BookOpen },
    { id: "financial", label: "Financial", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              {mode =="create" ? "Create New Student" : "Edit Student"}
            </h1>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6">
          <div className="flex overflow-x-auto gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeSection === section.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              {activeSection === "personal" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <User className="text-indigo-600" size={20} />
                    </div>
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.gender ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.dateOfBirth
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.district ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter district"
                      />
                      {errors.district && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.district}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {activeSection === "contact" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="text-green-600" size={20} />
                    </div>
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="student@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter complete address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.pincode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="560001"
                        />
                        {errors.pincode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Qualification Details */}
              {activeSection === "qualification" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="text-orange-600" size={20} />
                    </div>
                    Qualification Details
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Highest Qualification{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="highestQualification"
                          value={formData.highestQualification}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.highestQualification
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select qualification</option>
                          <option value="High School (10th)">
                            High School (10th)
                          </option>
                          <option value="Higher Secondary (12th)">
                            Higher Secondary (12th)
                          </option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's Degree">
                            Bachelor's Degree
                          </option>
                          <option value="Master's Degree">
                            Master's Degree
                          </option>
                        </select>
                        {errors.highestQualification && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.highestQualification}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Year of Passout{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="yearOfPassout"
                          value={formData.yearOfPassout}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.yearOfPassout
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="2024"
                        />
                        {errors.yearOfPassout && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.yearOfPassout}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name of Last Institution{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastInstitution"
                        value={formData.lastInstitution}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.lastInstitution
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter institution name"
                      />
                      {errors.lastInstitution && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastInstitution}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address of Institution{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="institutionAddress"
                        value={formData.institutionAddress}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.institutionAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter institution address"
                      />
                      {errors.institutionAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.institutionAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Guardian Details */}
              {activeSection === "guardian" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="text-blue-600" size={20} />
                    </div>
                    Guardian Details
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Guardian Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.guardianName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter guardian name"
                      />
                      {errors.guardianName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guardianName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Guardian Mobile Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="guardianMobile"
                        value={formData.guardianMobile}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.guardianMobile
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.guardianMobile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guardianMobile}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Guardian Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="guardianAddress"
                        value={formData.guardianAddress}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.guardianAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter guardian's complete address"
                      />
                      {errors.guardianAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guardianAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Information */}
              {activeSection === "academic" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-indigo-600" size={20} />
                    </div>
                    Academic Information
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mode === "edit" && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Admission Number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="admissionNo"
                            value={formData.admissionNo}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                              errors.admissionNo
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="ADM2024001"
                            readOnly // Usually admission number shouldn't be changed manually
                          />
                          {errors.admissionNo && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.admissionNo}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Joining Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="joiningYear"
                          value={formData.joiningYear}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.joiningYear
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="2024"
                        />
                        {errors.joiningYear && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.joiningYear}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.department
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select department</option>
                          <option value="Computer Science">
                            Computer Science
                          </option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Civil">Civil</option>
                          <option value="Information Technology">
                            Information Technology
                          </option>
                          <option value="Electrical">Electrical</option>
                        </select>
                        {errors.department && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.department}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Year <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.year ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select year</option>
                          <option value="1">Year 1</option>
                          <option value="2">Year 2</option>
                          <option value="3">Year 3</option>
                          <option value="4">Year 4</option>
                        </select>
                        {errors.year && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.year}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                          errors.course ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Course</option>
                        {coursesData?.map((course) => (
                          <option key={course._id} value={course.name}>
                            {course.name} ({course.duration})
                          </option>
                        ))}
                      </select>
                      {errors.course && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.course}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Information */}
              {activeSection === "financial" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    Financial Information
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Original Course Fees{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="courseFeesOriginal"
                          value={formData.courseFeesOriginal}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                            errors.courseFeesOriginal
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="150000"
                        />
                        {errors.courseFeesOriginal && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.courseFeesOriginal}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                          placeholder="15"
                        />
                      </div>
                    </div>

                    {formData.courseFeesOriginal && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Fee Calculation
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-green-200">
                            <span className="text-gray-600">Original Fees</span>
                            <span className="text-lg font-semibold text-gray-800">
                              ₹
                              {parseFloat(
                                formData.courseFeesOriginal
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-green-200">
                            <span className="text-gray-600">
                              Discount ({formData.discount}%)
                            </span>
                            <span className="text-lg font-semibold text-green-600">
                              - ₹
                              {(
                                ((parseFloat(formData.courseFeesOriginal) ||
                                  0) *
                                  (parseFloat(formData.discount) || 0)) /
                                100
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="pt-2">
                            <div className="bg-green-600 text-white rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium opacity-90">
                                  Total Amount After Discount
                                </span>
                                <span className="text-2xl font-bold">
                                  ₹
                                  {calculateTotalAmount().toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Fee Installments Section */}
                  {formData.payments && formData.payments.length > 0 && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Fee Installments ({formData.payments.length} Months)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formData.payments.map((payment, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{payment.month}</label>
                             <div className="space-y-2">
                                <input
                                    type="number"
                                    name={`payment_${index}_amount`}
                                    value={payment.amount}
                                    onChange={handleChange}
                                    placeholder="Amount Collected"
                                    className="w-full px-3 py-2 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <input
                                    type="date"
                                    name={`payment_${index}_paidOn`}
                                    value={payment.paidOn}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm text-gray-500"
                                />
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Right Sidebar - Summary & Actions */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Form Progress
                </h3>
                <div className="space-y-3">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-indigo-50 border-2 border-indigo-500"
                            : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isActive ? "text-indigo-600" : "text-gray-600"
                          }`}
                        >
                          {section.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Save size={20} />
                    {mode === "create" ? "Create Student" : "Update Student"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>

              {/* Help Card */}
            </div>
          </div>
        </form>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Fill in all required fields marked with{" "}
            <span className="text-red-500">*</span> to create a student record.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-0.5">•</span>
              <span>
                Use the section tabs to navigate through different information
                categories
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-0.5">•</span>
              <span>
                Discount will be automatically calculated based on the original
                fees
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-0.5">•</span>
              <span>All fields with red asterisk are mandatory</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateEditStudent;
