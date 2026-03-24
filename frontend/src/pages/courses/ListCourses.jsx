/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Search, Plus, Filter, Clock, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';
import AddEditCourseModal from '../../components/modal/AddEditModal';
import { apiClient } from '../../config/api';
import { userApiRoutes } from '../../config/apiRoutes';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';


const createCourse = async(data)=>{
    try{
        
        const response =await apiClient.post(userApiRoutes.CREATE_COURSE,data)
        return response.data
    }catch(err){
        console.log(err)
    }
}

const editCourse = async(data)=>{
    try{
        console.log(data,'edit function')
        const response =await apiClient.put(userApiRoutes.UPDATE_COURSE,data)
        return response.data
    }catch(err){
        console.log(err)
    }
}

const fetchCourse = async ()=>{
    try{
        const response = await apiClient.get(userApiRoutes.LIST_COURSES)
        return response.data
    }catch(err){
        console.log(err)
    }
}

function ListCourses() {
    const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [open, setOpen] = useState(false);
const [mode, setMode] = useState("add");
const [selectedCourse, setSelectedCourse] = useState(null);

const handleAddCourse = () => {
  setMode("add");
  setSelectedCourse(null);
  setOpen(true);
};


const {data,isLoading} = useQuery({
    queryKey:['fetch-courses'],
    queryFn:fetchCourse
})
const {mutate,isPending} = useMutation({
    mutationKey:['create-course'],
    mutationFn:createCourse,
    onSuccess:(data)=>{
        console.log('sucess')
        if(data.success){
            setOpen(false)
        }
    }
})
const {mutate:editMutate,isPending:editPending} = useMutation({
    mutationKey:['create-course'],
    mutationFn:editCourse,
    onSuccess:(data)=>{
        console.log('sucess')
        if(data.success){
            setOpen(false)
            queryClient.invalidateQueries(['fetch-courses'])
        }
    }
})

// EDIT
const handleEditCourse = (course) => {
  setMode("edit");
  setSelectedCourse(course);
  setOpen(true);
};

const handleSubmit = (formData) => {
  if (mode === "add") {
    // createCourseMutation.mutate(formData);
    // console.log(formData,'data')
    mutate(formData)
    console.log(formData,'add')
  } else {
    // updateCourseMutation.mutate({
    //   id: selectedCourse._id,
    //   ...formData,
    // });
    editMutate(formData)
    console.log(formData,'edit')

  }
};


  const filteredCourses = data?.courses?.filter(course => {
    const matchesSearch = course.shortName.toLowerCase().includes(searchTerm.toLowerCase()) 
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && course.isActive) ||
                         (filterActive === 'inactive' && !course.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Course Catalog</h1>
          <p className="text-slate-600">Explore and manage available courses</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setFilterActive('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterActive === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterActive('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterActive === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterActive('inactive')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterActive === 'inactive' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Inactive
                </button>
              </div>
              
              <button onClick={handleAddCourse} className="flex items-center gap-2 bgGradient text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {filteredCourses?.map((course) => (
    <div
      key={course._id}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          {/* Course Name */}
          <h3 className="text-xl font-bold text-slate-800 mb-1">
            {course.name}
          </h3>

          {/* Status */}
          <div className="flex items-center gap-2">
            {course.isActive ? (
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500 text-sm font-medium bg-slate-100 px-2 py-1 rounded-full">
                <XCircle className="w-4 h-4" />
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Short Name */}
      <p className="text-slate-600 text-sm mb-4">
        Short Name: <span className="font-medium">{course.shortName}</span>
      </p>

      {/* Duration & Fees */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Duration</p>
            <p className="text-sm font-semibold">
              {course.duration} Months
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <div className="bg-emerald-50 p-2 rounded-lg">
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Course Fees</p>
            <p className="text-sm font-semibold">
              ₹{course.fees.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="border-t border-slate-100 pt-4 mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Created: {new Date(course.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Updated: {new Date(course.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {/* <button className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
          View Details
        </button> */}

        <button
          onClick={() => handleEditCourse(course)}
          className="flex-1 bgGradient text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Edit Course
        </button>
      </div>
    </div>
  ))}
</div>


        {filteredCourses?.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-slate-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No courses found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      <AddEditCourseModal
  isOpen={open}
  onClose={() => setOpen(false)}
  mode={mode}
  existingCourse={selectedCourse}
  onSubmit={handleSubmit}
//   isLoading={createCourseMutation.isLoading || updateCourseMutation.isLoading}
  isLoading={false}

/>
    </div>
  );
}

export default ListCourses;