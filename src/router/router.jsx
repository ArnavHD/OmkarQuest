import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import DailyQuestionnaire from "../pages/Questions/DailyQuestionnaire/DailyQuestionnaire";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "../routes/PrivateRoute";
import MyProgress from "../pages/Dashboard/MyProgress/MyProgress";
import Dashboard from "../pages/Dashboard/Dashboard/Dashboard";
import ProgressTable from "../pages/Dashboard/ProgressTable/ProgressTable";
import OwnerMathQuestionnaire from "../pages/Questions/OwnerMathQuestionnaire/OwnerMathQuestionnaire";
import OwnerYesNoQuestionnaire from "../pages/Questions/OwnerYesNoQuestionnaire/OwnerYesNoQuestionnaire";
import OwnerOverallProgress from "../pages/Dashboard/OverallProgress/OwnerOverallProgress";
import OwnerOverallProgressTable from "../pages/Dashboard/OverallProgress/OwnerOverallProgressTable";
import Profile from "../pages/Dashboard/Profile/Profile";
import ComingSoon from "../pages/ComingSoon/ComingSoon";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
      },
      {
        path: "dailyQuestionnaire",
        element: <PrivateRoute><DailyQuestionnaire></DailyQuestionnaire></PrivateRoute>,
      },
      {
        path: "my-progress",
        element: (
          <PrivateRoute>
            <MyProgress />
          </PrivateRoute>
        ),
      },
      {
        path: "progress-table",
        element: (
          <PrivateRoute>
            <ProgressTable></ProgressTable>
          </PrivateRoute>
        ),
      },
      {
        path: "owner-math",
        element: (
          <PrivateRoute>
            <OwnerMathQuestionnaire />
          </PrivateRoute>
        ),
      },
      {
        path: "owner-reflection",
        element: (
          <PrivateRoute>
            <OwnerYesNoQuestionnaire />
          </PrivateRoute>
        ),
      },
      {
        path: "overall-progress",
        element: (
          <PrivateRoute>
            <OwnerOverallProgress></OwnerOverallProgress>
          </PrivateRoute>
        ),
      },
      {
        path: "overall-progress-table",
        element: (
          <PrivateRoute>
            <OwnerOverallProgressTable></OwnerOverallProgressTable>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/comingSoon",
    element: <ComingSoon></ComingSoon>
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>
  }
]);
