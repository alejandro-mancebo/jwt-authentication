import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RequireAuth from './components/require-auth';
import RootLayout from './pages/root-layout';
import HomePage from './pages/home-page';
import SignUpPage from './pages/signup-page';
import LoginPage from './pages/login-page';
import UserProfilePage from './pages/user-profile-page';

import './App.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      {/* <Route path="/link-page" element={<LinkPage />} /> */}
      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

      {/* protect routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
      </Route>

      {/* not found */}
      {/* <Route path="*" element={<Page404 />} /> */}
    </Route >
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
