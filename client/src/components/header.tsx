import { NavLink } from "react-router-dom";
import useAuth from '../../src/hooks/useAuth';
import { axiosPrivate } from '../api/axios';
import { useEffect, useState } from "react";


export const Header = () => {
  const { auth, setAuth }: any = useAuth();
  const [username, setUsername] = useState<string>();
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const usernameStore = localStorage.getItem('username') || '';

  useEffect(() => {
    if (Object.keys(auth).length !== 0) {
      setIsAuth(true)
      setUsername(usernameStore);
    }
  }, [auth, username]);


  const handleLogout = async () => {

    // Use axios
    await axiosPrivate.post('/logout', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      withCredentials: true
    })
      .then((response) => {
        if (response.status === 204) {
          setAuth({});
          //navigate('/', { replace: true });

          localStorage.removeItem('persist');
          // localStorage.removeItem('isLoading');
          localStorage.removeItem('username');
          window.location.reload();
        }
      })
      .catch((errors) => {
        if (!errors) {
          console.error('[header] No server response');
        } else if (errors) {
          console.error('[header] Something happend');
        } else {
          console.error('[header] Logout failed');
        }
      });
  };


  return (
    <header >
      <div >
        <NavLink to={"/"}>Home</NavLink>
        {isAuth && usernameStore ?
          <>
            <NavLink to='/users'>User List</NavLink>
            {/* <NavLink to='/user-profile'>Profile</NavLink> */}
          </>
          : null
        }
      </div>

      <nav >
        <span >
          {isAuth && usernameStore
            ? <NavLink to='/user-profile'>{username}</NavLink>
            : null
          }
        </span>

        {!isAuth ?
          <div>
            <NavLink to='/signup'>Sign Up</NavLink>
            <NavLink to='/login'>Login</NavLink>
          </div>
          : null
        }

        {isAuth
          ? <button type="button" onClick={handleLogout}>logout</button>
          : null
        }
      </nav>
    </header>
  );
};
