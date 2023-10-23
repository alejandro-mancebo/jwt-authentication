import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RootLayout from './pages/root-layout';
import SignUpPage from './pages/signup-page';
import LoginPage from './pages/login-page';
import UserProfilePage from './pages/user-profile-page';

import './App.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
