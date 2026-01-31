export const userApiRoutes = {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/register',
    
    // Student Routes
    CREATE_STUDENT: '/api/student/create',
    GET_STUDENTS: '/api/student/list',
    GET_STUDENT_PROFILE: '/api/student/profile', // Append /:studentId in usage
    UPDATE_FEES: '/api/student/fees', // Append /:studentId
    UPDATE_STUDENT: '/api/student/update', // Append /:studentId

    // Admin/Course Routes
    CREATE_COURSE: '/api/admin/course', 
    UPDATE_COURSE: '/api/admin/course', // Append /:id in usage
    LIST_COURSES: '/api/admin/course', 
    DELETE_COURSE: '/api/admin/course', // Append /:id in usage
    DASHBOARD_STATS: '/api/admin/dashboard-stats'
}