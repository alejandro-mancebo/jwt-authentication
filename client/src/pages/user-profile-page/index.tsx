import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { axiosAuth } from "../../api/axios";

export default function index() {
  const { setAuth }: any = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {

    // Use axios
    await axiosAuth.post('/logout', {
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
      <h1>User Profile Page</h1>
      <div ><Link to="/">Go to Home page</Link></div>
      <button type="button" onClick={handleLogout}>logout</button>
    </section>
  )
}
