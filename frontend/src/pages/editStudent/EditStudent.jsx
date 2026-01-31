
import React from 'react'

import { useParams } from 'react-router-dom'
import { apiClient } from '../../config/api'
import { userApiRoutes } from '../../config/apiRoutes'
import { useQuery } from '@tanstack/react-query'
import CreateEditStudent from '../../components/form/CreateStudent'

const fetchStudentDetails = async(id)=>{
  try{
     const response = await apiClient.get(`${userApiRoutes.GET_STUDENT_PROFILE}/${id}`)
     return response.data
  }catch(err){
    console.log(err)
  }
}

const EditStudent = () => {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['edit-student', id],
    queryFn: () => fetchStudentDetails(id),
    enabled: !!id, // safety check
  })

  if (isLoading) {
    return <div>Loading student details...</div>
  }

  if (isError) {
    return <div>Failed to load student details</div>
  }

  return (
    <CreateEditStudent
      mode="edit"
      existingStudent={data?.studentDetails}
    />
  )
}

export default EditStudent