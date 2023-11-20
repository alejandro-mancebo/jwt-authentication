import { Link, useNavigate } from 'react-router-dom';
import { axiosPrivate } from "../../api/axios";
import useAuth from '../../hooks/useAuth';


export default function HomePage() {
  const navigate = useNavigate();
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

          // localStorage.removeItem('jwt');
          // localStorage.removeItem('email');
          localStorage.removeItem('persist');
          window.location.reload();
        }
      })
      .catch((errors) => {
        if (!errors) {
          console.error('[Home page] No server response');
        } else if (errors) {
          console.error('[Home page] Something happend');
        } else {
          console.error('[Home page] Logout failed');
        }
      });
  };


  return (
    <section>
      {Object.keys(auth).length !== 0 
        ? <>
          <h1>Home Page</h1>
          <div><Link to='/users'>User List</Link></div>
          <div><Link to='/user-profile'>Profile</Link> </div>
        </>
        : <div>Welcome to the JWT Authentication example</div>
      }
    </section>
  )
}
