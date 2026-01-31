import { User, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Users, FileText, DollarSign, ArrowLeft, Edit } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CLIENTROUTES } from '../../../../backend/routes/clientRoutes';
import { apiClient } from '../../config/api';
import { userApiRoutes } from '../../config/apiRoutes';
import { useQuery } from '@tanstack/react-query';

const getStudentDetails = async (studentId) => {
  const response = await apiClient.get(`${userApiRoutes.GET_STUDENT_PROFILE}/${studentId}`);
  return response.data;
};

const studentFallback = {
  _id: 'local-1',
  firstName: 'Loading',
  lastName: 'Student',
  gender: '—',
  dateOfBirth: '2002-01-01T00:00:00.000Z',
  email: '',
  phone: '',
  pincode: '',
  address: '',
  city: '',
  state: '',
  district: '',
  lastInstitution: '',
  yearOfPassout: '',
  institutionAddress: '',
  highestQualification: '',
  guardianName: '',
  guardianAddress: '',
  guardianMobile: '',
  admissionNo: '',
  joiningYear: '',
  department: '',
  course: '',
  year: '',
  status: '',
  courseFeesOriginal: 0,
  discount: 0,
  totalAmountAfterDiscount: 0,
};

const StudentProfile = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['student-details', id],
    queryFn: () => getStudentDetails(id),
    enabled: !!id,
  });

  const student = data?.studentDetails ?? studentFallback;

  const calculateAge = (dob) => {
    if (!dob) return '—';
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return '—';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date)) return '—';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const computeDiscountAmount = (original = 0, discount = 0) => {
    if (!original || !discount) return 0;
    const d = Number(discount);
    const orig = Number(original);
    if (d <= 100) {
      return Math.round((orig * d) / 100);
    }
    return Math.round(d);
  };

  const discountAmount = computeDiscountAmount(student.courseFeesOriginal, student.discount);
  const totalAfterDiscount =
    student.totalAmountAfterDiscount ?? Math.max(0, Number(student.courseFeesOriginal || 0) - discountAmount);

  const editLink = CLIENTROUTES.STUDENT_EDIT.replace(':id', student._id || id || '0');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading student profile…</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-medium">Failed to load student details. Please try again.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span>Back to Students</span>
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl shadow-lg border-2 sm:border-4 border-white border-opacity-30 flex-shrink-0">
                {(student.firstName?.charAt(0) ?? '') + (student.lastName?.charAt(0) ?? '')}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 truncate">
                  {student.firstName} {student.lastName}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-indigo-100">
                  <span className="flex items-center gap-1 sm:gap-2">
                    <FileText size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{student.admissionNo || '—'}</span>
                  </span>
                  <span className="flex items-center gap-1 sm:gap-2">
                    <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    Joined {student.joiningYear || '—'}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium inline-block w-fit">
                    {student.status || '—'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Link to={editLink} className="flex-1 sm:flex-initial">
                <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base">
                  <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Edit
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Personal & Contact Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-indigo-600" size={18} />
                </div>
                <span className="truncate">Personal Information</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">{student.firstName || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">{student.lastName || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Gender</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1">{student.gender || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">
                    {formatDate(student.dateOfBirth)} ({calculateAge(student.dateOfBirth)} years)
                  </p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">District</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">{student.district || student.city || '—'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-green-600" size={18} />
                </div>
                <span className="truncate">Contact Information</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-purple-500 mt-1 flex-shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide block">Email Address</label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 mt-1 break-all">{student.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-green-500 mt-1 flex-shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide block">Phone Number</label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 mt-1 break-words">{student.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-red-500 mt-1 flex-shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide block">Address</label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 mt-1 break-words">{student.address || '—'}</p>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                      {student.city || '—'}, {student.state || '—'} - {student.pincode || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Qualification Details */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="text-orange-600" size={18} />
                </div>
                <span className="truncate">Qualification Details</span>
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Highest Qualification</label>
                    <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">{student.highestQualification || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Year of Passout</label>
                    <p className="text-base sm:text-lg text-gray-800 mt-1">{student.yearOfPassout || '—'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Last Institution</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">{student.lastInstitution || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Institution Address</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">{student.institutionAddress || '—'}</p>
                </div>
              </div>
            </div>

            {/* Guardian Details */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="text-blue-600" size={18} />
                </div>
                <span className="truncate">Guardian Details</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Guardian Name</label>
                  <p className="text-base sm:text-lg text-gray-800 mt-1 break-words">{student.guardianName || '—'}</p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-green-500 mt-1 flex-shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide block">Mobile Number</label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 mt-1 break-words">{student.guardianMobile || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-red-500 mt-1 flex-shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide block">Address</label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 mt-1 break-words">{student.guardianAddress || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Academic & Financial Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Academic Information */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-indigo-600" size={18} />
                </div>
                <span className="truncate">Academic Info</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <label className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wide block">Course</label>
                  <p className="text-sm sm:text-base text-gray-800 mt-1 font-medium break-words">{student.course || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</label>
                  <p className="text-sm sm:text-base text-gray-800 mt-1 break-words">{student.department || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Year</label>
                  <p className="text-sm sm:text-base text-gray-800 mt-1">Year {student.year || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Admission Number</label>
                  <p className="text-sm sm:text-base text-gray-800 mt-1 font-mono break-all">{student.admissionNo || '—'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Joining Year</label>
                  <p className="text-sm sm:text-base text-gray-800 mt-1">{student.joiningYear || '—'}</p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl shadow-sm border border-green-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="text-green-600" size={18} />
                </div>
                <span className="truncate">Fee Details</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-green-200 gap-2">
                  <span className="text-sm sm:text-base text-gray-600">Original Course Fees</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-800 break-words text-right">{formatCurrency(student.courseFeesOriginal)}</span>
                </div>

                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-green-200 gap-2">
                  <span className="text-sm sm:text-base text-gray-600">Discount Applied</span>
                  <span className="text-base sm:text-lg font-semibold text-green-600 break-words text-right">
                    {student.discount != null
                      ? student.discount <= 100
                        ? `${student.discount}%`
                        : `${formatCurrency(student.discount)}`
                      : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-green-200 gap-2">
                  <span className="text-sm sm:text-base text-gray-600">Discount Amount</span>
                  <span className="text-base sm:text-lg font-semibold text-green-600 break-words text-right">- {formatCurrency(discountAmount)}</span>
                </div>

                <div className="pt-2">
                  <div className="bg-green-600 text-white rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium opacity-90">Total Amount</span>
                      <span className="text-xl sm:text-2xl font-bold break-words text-right">{formatCurrency(totalAfterDiscount)}</span>
                    </div>
                    {student.createdAt && (
                      <div className="text-xs opacity-80 mt-2">
                        Record created on {formatDate(student.createdAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Quick Stats</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">Age</span>
                  <span className="font-semibold text-blue-600 text-sm sm:text-base">{calculateAge(student.dateOfBirth)} years</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">Status</span>
                  <span className="font-semibold text-purple-600 text-sm sm:text-base break-words text-right">{student.status}</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 bg-orange-50 rounded-lg gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">Year of Study</span>
                  <span className="font-semibold text-orange-600 text-sm sm:text-base">Year {student.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default StudentProfile;