import { Link } from "react-router-dom";
import { UserProfile } from "./user-profile";


export default function index() {
  return (
    <section>
      <h1>User Profile Page</h1>
      <UserProfile />
      <div ><Link to="/">Go to Home page</Link></div>
    </section>
  )
}
