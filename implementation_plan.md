# Admin Panel Implementation Plan

## User Requirements
- Admin Panel for Student Portal
- **Dashboard**
- **Student Management**: List, Edit, Create
- **Course Management**: List, Edit, Create
- **Fee Management**: 
    - Dynamic installments based on course duration (e.g. 3 months -> 3 installments).
    - Track collected fees.
- **Authentication**: Backend & Frontend (Login).
- **Deadline**: Tomorrow (Urgent).

## Current Status Analysis
*To be filled after exploration*

## Proposed Tasks
1.  **Authentication**
    - [ ] Backend: User model, Auth controller (login/register), Middleware (verifyToken).
    - [ ] Frontend: Login page, AuthContext/Provider, Protected Routes.

2.  **Course Management**
    - [ ] Backend: Course model (name, duration, fee total), Routes, Controller.
    - [ ] Frontend: Course List page, Add/Edit Course modal/page.

3.  **Student Management**
    - [ ] Backend: Student model (details, course reference), Routes, Controller.
    - [ ] Frontend: Student List page, Add/Edit Student page.

4.  **Fee Structure Logic**
    - [ ] Backend: Fee model (linked to Student & Course).
        - Logic: On student creation/enrollment, generate fee records based on course duration? Or store as array in Student?
    - [ ] Frontend: Dynamic form fields for fee payment.
        - Logic: When selecting a course for a student, show X installments.
        - Interface to update "Paid" status or amount.

5.  **Dashboard**
    - [ ] Basic stats (Total Students, Total Courses, Total/Pending Fees).

## Implementation Order
1.  Backend Models & Routes (Auth, Course, Student).
2.  Frontend Auth integration.
3.  Course CRUD (Prerequisite for Students).
4.  Student CRUD with Fee logic.
5.  Final Polish/Dashboard.
