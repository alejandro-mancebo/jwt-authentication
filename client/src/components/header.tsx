import { NavLink } from "react-router-dom";
import useAuth from '../../src/hooks/useAuth';
import { axiosPrivate } from '../api/axios';


export const Header = () => {
  const { auth, setAuth }: any = useAuth();


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

          localStorage.removeItem('jwt');
          localStorage.removeItem('email');
          localStorage.removeItem('persist');
          window.location.reload();
        }
      })
      .catch((errors) => {
        if (!errors) {
          console.log('No server response');
        } else if (errors) {
          console.log('Something happend');
        } else {
          console.log('Logout failed');
        }
      });
  };


  return (
    <header >
      <div >
        <NavLink to={"/"}>Home</NavLink>
        {Object.keys(auth).length !== 0 && (
          <>
            <NavLink to='/users'>User List</NavLink>
            <NavLink to='/user-profile'>Profile</NavLink>
          </>
        )}
      </div>

      <nav className="">
        <span>
          {Object.keys(auth).length !== 0
            ? <p> {auth?.user.name} </p>
            : null
          }
        </span>

        {Object.keys(auth).length === 0
          ? <NavLink to='/signup'>Sign Up</NavLink>
          : null
        }

        {Object.keys(auth).length === 0
          ? <NavLink to='/login'>Login</NavLink>
          : null
        }

        {Object.keys(auth).length !== 0
          ? <button type="button" onClick={handleLogout}>logout</button>
          : null
        }
      </nav>
    </header>
  );
};
