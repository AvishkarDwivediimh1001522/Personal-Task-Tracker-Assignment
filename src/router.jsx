import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
//import SettingsPage from './pages/SettingsPage';
import Layout from './utilities/Layout';
import AuthGuard from './components/AuthGuard';

import AboutPage from './pages/AboutPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <Layout>
          <DashboardPage />
        </Layout>
      </AuthGuard>
    )
  },
  {
    path: '/TasksPage',
    element: (
      <AuthGuard>
        <Layout>
          <TasksPage />
        </Layout>
      </AuthGuard>
    )
  },
  {
    path: '/AboutPage',
    element: (
      <AuthGuard>
        <Layout>
          <AboutPage/>
        </Layout>
      </AuthGuard>
    )
  }
]);