import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/Login';
import Projects from './pages/admin/Projects';
import Home from './pages/public/Home';
import PublicLayout from './layouts/PublicLayout';
import Skills from './pages/admin/Skills';
import Profile from './pages/admin/Profile';
import Education from './pages/admin/Education';
import Experience from './pages/admin/Experience';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'projects',
            element: <Projects />,
          },
          {
            path: 'skills',
            element: <Skills />,
          },
          {
            path: 'education',
            element: <Education />,
          },
          {
            path: 'experience',
            element: <Experience />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to="/" />,
  },
]);
