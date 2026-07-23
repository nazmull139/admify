import { createBrowserRouter } from "react-router";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AgencyDashboard from "../pages/agency/AgencyDashboard";
import AgentDashboard from "../pages/agent/AgentDashboard";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Home from "../pages/home/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Pricing from "../pages/public/Pricing";
import Universities from "../pages/public/Universities";
import UniversityDetail from "../pages/public/UniversityDetail";
import RepresentativeDashboard from "../pages/representative/RepresentativeDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/> ,
        children : [
            {
                path : "/",
                element : <Home/>
            },
            {
                path : "/about",
                element : <About/>
            },
            {
                path : "/contact",
                element : <Contact/>
            },
            {
                path : "/universities",
                element : <Universities/>
            },
            {
                path : "/universities/:id",
                element : <UniversityDetail/>
            },
            {
                path : "/pricing",
                element : <Pricing/>
            },
        ]
    } ,
    {
        path : "/login",
        element : <Login/>
    },
    {
        path : "/register",
        element : <Register/>
    },
    {
        path : "/verify-otp",
        element : <VerifyOtp/>
    },
    {
        path : "/forgot-password",
        element : <ForgotPassword/>
    },
    {
        path : "/reset-password",
        element : <ResetPassword/>
    },
    {
        path : "/studentdashboard",
        element : <ProtectedRoute role="Student"><StudentDashboard/></ProtectedRoute>
    },
    {
        path : "/agentdashboard",
        element : <ProtectedRoute role="Agent"><AgentDashboard/></ProtectedRoute>
    },
    {
        path : "/agencydashboard",
        element : <ProtectedRoute role="Agency"><AgencyDashboard/></ProtectedRoute>
    },
    {
        path : "/admindashboard",
        element : <ProtectedRoute role="Admin"><AdminDashboard/></ProtectedRoute>
    },
    {
        path : "/representativedashboard",
        element : <ProtectedRoute role="Representative"><RepresentativeDashboard/></ProtectedRoute>
    },
])


export default router;
