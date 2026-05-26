import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import AuthLayout from "./../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import ErrorComponent from "../components/Reusable/ErrorComponent/ErrorComponent";
import NotFound from "../pages/NotFound/NotFound";
import Queries from "../pages/Dashboard/Queries/Queries";
import Issues from "../pages/Dashboard/Issues/Issues";
import RaiseOrEditIssue from "../pages/Dashboard/RaiseOrEditIssue/RaiseOrEditIssue";
import RaiseQuery from "../pages/Dashboard/RaiseQuery/RaiseQuery";

export const router = createBrowserRouter([
  // Main layout routes
  {
    path: "/",
    element: <AuthLayout />,
    // errorElement: <ErrorComponent />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  // Admin dashboard routes
  {
    path: "dashboard/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorComponent />,
    children: [
      {
        path: "issues",
        element: <Issues />,
      },
      {
        path: "raise-issue",
        element: <RaiseOrEditIssue />,
      },
      {
        path: "raise-issue/:id",
        element: <RaiseOrEditIssue />,
      },
      {
        path: "queries",
        element: <Queries />,
      },
      {
        path: "raise-query",
        element: <RaiseQuery />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
