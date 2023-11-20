import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = () => {
  const { auth }: any = useAuth();
  const location = useLocation();

  return (
    auth?.accessToken
      ? <Outlet />
      : <Navigate to='/' state={{ from: location }} replace />

    // auth?.email
    //   ? <Outlet />
    //   : auth?.accessToken //changed from user to accessToken to persist login after refresh
    //     ? <Navigate to='/use-profile' state={{ from: location }} replace />
    //     : <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default RequireAuth;

