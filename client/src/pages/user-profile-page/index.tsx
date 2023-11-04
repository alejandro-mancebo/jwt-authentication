import { Link } from "react-router-dom";
import UsersPage from "../users-page";

export default function index() {
  return (
    <section>
      <h1>User Profile Page</h1>
      <UsersPage />
      <div ><Link to="/">Go to Home page</Link></div>
    </section>
  )
}
