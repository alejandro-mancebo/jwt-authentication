import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section>
      <h1>Home Page</h1>
      <Link to='/'>Home</Link><br />
      <Link to='/login'>Login</Link><br />
      <Link to='/signup'>Sign Up</Link><br />
      <Link to='/user-profile'>Profile</Link>
    </section>
  )
}
