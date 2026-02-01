export const userApiRoutes = {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/register',
    
    // Student Routes
    STUDENT_LOGIN: '/api/student/login',
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
    DASHBOARD_STATS: '/api/admin/dashboard-stats',
    
    // Expense Routes
    CREATE_EXPENSE: '/api/user/create-expense',
    GET_EXPENSES: '/api/user/expenses',
    UPDATE_EXPENSE: '/api/user/update-expense', // Append /:id in usage
    DELETE_EXPENSE: '/api/user/delete-expense', // Append /:id in usage
    GET_EXPENSE: '/api/user/expense-profile' // Append /:id in usage
}