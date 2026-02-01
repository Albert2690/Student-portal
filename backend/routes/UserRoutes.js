import express from 'express'
import { createCourse, listCourse, updateCourse, userLogin, userRegister } from '../controllers/UserController.js'
import { createStudent, listStudentProfile, listStudents } from '../controllers/StudentController.js'
import { createExpense, listExpenseProfile, listExpenses, updateExpense } from '../controllers/ExpenseController.js'

const Router = express.Router()

Router.post('/login',userLogin)
Router.post('/register',userRegister)
Router.post('/create-student',createStudent)
Router.get('/students',listStudents)
Router.get('/student-profile/:studentId',listStudentProfile)
Router.post('/create-course',createCourse)
Router.put('/update-course',updateCourse)
Router.get('/list-courses',listCourse)
Router.post('/create-expense',createExpense)
Router.get('/expenses',listExpenses)
Router.get('/expense-profile/:expenseId',listExpenseProfile)
Router.put('/update-expense/:expenseId',updateExpense)
// Router.delete('/delete-expense/:expenseId',deleteExpense)









export default Router
