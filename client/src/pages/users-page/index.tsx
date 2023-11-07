import { Link } from "react-router-dom";
import { Users } from "./users";
import useAuth from '../../hooks/useAuth';

export default function index() {
  const { auth }: any = useAuth();
  return (
    <section>
      <h1>Users</h1>
      {Object.keys(auth).length !== 0
        ? <><p> {auth?.user.email} </p><hr /><br /></>
        : null
      }
      <Users />

      <br /><hr />
      <div ><Link to="/">Go to Home page</Link></div>
    </section>
  )
}
