import React, { useState, useMemo } from "react";
import {
  Search,
  User,
  Phone,
  BookOpen,
  Calendar,
  Hash,
  Users,
  Mail,
  MapPin,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../config/api";
import { userApiRoutes } from "../../config/apiRoutes";

const localStudents = [
  /* your local sample array (kept as fallback) */
];

const fetchStudents = async () => {
  try {
    const response = await apiClient.get(userApiRoutes.GET_STUDENTS);
    return response.data; // expects { success: true, students: [...] }
  } catch (err) {
    console.log("fetchStudents error:", err);
    return undefined;
  }
};

function StudentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: ["list-student"],
    queryFn: fetchStudents,
    // you can add staleTime, refetchInterval etc. as needed
  });

  // use backend data if available, fallback to local sample
  const sourceStudents = (data && data.students) || localStudents;

  // derive filters from live source
  const departments = ["All", ...new Set(sourceStudents.map((s) => s.department || "Unknown"))];
  const years = ["All", ...new Set(sourceStudents.map((s) => s.joiningYear || "Unknown"))];

  const maskEmail = (email = "") => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (!domain) return email;
    const visible = localPart.slice(0, Math.min(3, localPart.length));
    return `${visible}${localPart.length > 3 ? "..." : ""}@${domain}`;
  };

  const maskPhone = (phone = "") => {
    if (!phone) return "";
    const last = phone.slice(-2);
    return phone.length > 4 ? `****${last}` : phone;
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "—";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate)) return "—";
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const payable = (s) => {
    const original = Number(s.courseFeesOriginal || 0);
    const disc = Number(s.discount || 0);
    // treat discount as fixed deduction (change logic if you need percent detection)
    return Math.max(0, original - disc);
  };

  const getInitials = (firstName = "", lastName = "") => {
    const a = (firstName || "").trim().charAt(0) || "";
    const b = (lastName || "").trim().charAt(0) || "";
    return `${a}${b}`.toUpperCase() || "NA";
  };

  // Filter and sort using the sourceStudents array
  const filteredAndSortedStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = sourceStudents.filter((student) => {
      const first = (student.firstName || "").toLowerCase();
      const last = (student.lastName || "").toLowerCase();
      const admission = (student.admissionNo || "").toLowerCase();
      const course = (student.course || "").toLowerCase();

      const matchesSearch =
        !term ||
        first.includes(term) ||
        last.includes(term) ||
        admission.includes(term) ||
        course.includes(term);

      const matchesDepartment = selectedDepartment === "All" || (student.department === selectedDepartment);
      const matchesYear = selectedYear === "All" || (student.joiningYear === selectedYear);

      return matchesSearch && matchesDepartment && matchesYear;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName || ""} ${a.lastName || ""}`.localeCompare(`${b.firstName || ""} ${b.lastName || ""}`);
        case "admissionNo":
          return (a.admissionNo || "").localeCompare(b.admissionNo || "");
        case "year":
          return (b.joiningYear || "").localeCompare(a.joiningYear || "");
        case "department":
          return (a.department || "").localeCompare(b.department || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [sourceStudents, searchTerm, selectedDepartment, selectedYear, sortBy]);

  const handleCardClick = (id) => {
    // prefer _id from backend else id from local sample
    navigate(`/student-profile/${id}`);
  };

  const getStatusColor = (status) =>
    status === "Active" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200";

  const handleNavigate = (id) => navigate(`/student-profile/${id}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Users className="text-indigo-600" size={40} />
            Student List
          </h1>
          <p className="text-gray-600 text-lg">Manage and view student information</p>
        </div>


        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            {/* Search */}
            <div className="relative col-span-2 lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "All" ? "All Departments" : dept}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year === "All" ? "All Years" : `Year ${year}`}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="admissionNo">Sort by Admission No</option>
              <option value="year">Sort by Year</option>
              <option value="department">Sort by Department</option>
            </select>

            {/* ➕ Add Student Button */}
            <button
              onClick={() => navigate("/create-student")}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              <Plus size={18} />
              Add Student
            </button>
          </div>
        </div>

        {/* Students List - One Card Per Row */}
        <div className="space-y-4">
          {filteredAndSortedStudents.map((student) => {
            const id = student._id || student.id;
            return (
              <div
                key={id}
                className="group bg-white shadow-sm hover:shadow-lg rounded-2xl p-6 cursor-pointer border border-gray-100 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-200 w-full"
                onClick={() => handleCardClick(id)}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {getInitials(student.firstName, student.lastName)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Hash size={14} />
                        <span>{student.admissionNo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {student.department}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 text-sm mb-2">Personal Info</h5>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} />
                        <span>
                          {student.gender}, {calculateAge(student.dateOfBirth)} years
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} />
                        <span>{student.district || student.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 text-sm mb-2">Contact</h5>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{maskPhone(student.phone)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span className="truncate">{maskEmail(student.email)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Info */}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 text-sm mb-2">Academic</h5>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen size={14} />
                        <span className="truncate">{student.course}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>Joined {student.joiningYear}</span>
                      </div>
                      {(student.courseFeesOriginal || student.discount) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          Fees: ₹{student.courseFeesOriginal ?? "—"} • Payable: ₹{payable(student)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-end justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-indigo-600 font-medium text-sm flex items-center gap-2">
                        <span onClick={() => handleNavigate(id)}>View Profile</span>
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredAndSortedStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPage;
