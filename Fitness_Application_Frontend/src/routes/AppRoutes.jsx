import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Activities from "../pages/Activities";
import AddActivity from "../pages/AddActivity";
import ActivityDetails from "../pages/ActivityDetails";
import EditActivity from "../pages/EditActivity";
import Recommendations from "../pages/Recommendations";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/error" element={<ErrorPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="activities" element={<Activities />} />
        <Route path="activities/add" element={<AddActivity />} />
        <Route path="activities/:id" element={<ActivityDetails />} />
        <Route path="activities/edit/:id" element={<EditActivity />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;