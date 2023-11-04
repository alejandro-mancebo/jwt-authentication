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
          navigate('/', { replace: true });
          localStorage.removeItem('jwt');
          localStorage.removeItem('email');
          localStorage.removeItem('persist');
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
    <section>
      <h1>Home Page</h1>
      {Object.keys(auth).length !== 0
        ? <p> {auth?.user.email} </p>
        : null
      }
      <hr />
      <br />
      <Link to='/'>Home</Link><br />
      <Link to='/login'>Login</Link><br />
      <Link to='/signup'>Sign Up</Link><br />
      <Link to='/user-profile'>Profile</Link> <br /><hr />

      <button type="button" onClick={handleLogout}>logout</button>
    </section>
  )
}
