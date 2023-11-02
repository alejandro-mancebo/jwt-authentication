import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = () => {
  const { auth }: any = useAuth();
  const location = useLocation();
  console.log('RequireAuth auth.user:', auth?.email);
  console.log('RequireAuth auth.accessToken:', auth?.accessToken);
  return (

    auth?.email && auth?.accessToken 
      ? <Outlet />


      : <Navigate to='/login' state={{ from: location }} replace />

    // auth?.email
    //   ? <Outlet />
    //   : auth?.accessToken //changed from user to accessToken to persist login after refresh
    //     ? <Navigate to='/use-profile' state={{ from: location }} replace />
    //     : <Navigate to='/login' state={{ from: location }} replace />
  )

}

export default RequireAuth;

