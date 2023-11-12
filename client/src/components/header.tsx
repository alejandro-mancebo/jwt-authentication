// import IMAGES from "../images/images";
import { NavLink, useLocation } from "react-router-dom";
// import { Avatar } from "@mui/material";
// import { useContext } from "react";
// import { AppContext } from "../hooks/index"; // Update the path to match your file structure
import { useNavigate } from "react-router-dom";
import useAuth from '../../src/hooks/useAuth';
import { axiosPrivate } from '../api/axios';


export const Header = () => {
  // const authContext = useContext(AppContext);
  const { pathname } = useLocation();
  const { auth, setAuth }: any = useAuth();
  console.log(pathname);

  const navigate = useNavigate();

  // console.log(authContext.isLoggedIn);

  // const handleLogout = () => {
  //   // Call the logout function from your context to log the user out.
  //   // authContext.logout();
  //   navigate("/login", {
  //     replace: true,
  //   });
  // };


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
