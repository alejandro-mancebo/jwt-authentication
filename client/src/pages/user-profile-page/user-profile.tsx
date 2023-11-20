import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { User } from '../../types/user.type';


export const UserProfile = () => {

  const [user, setUser] = useState<User>();
  const axiosPrivate = useAxiosPrivate();
  const auth: any = useAuth();

  useEffect(() => {
    const id = auth.auth._id;

    axiosPrivate.get(`/users/${id}`, {
      withCredentials: true,
    })
      .then((response) => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('[User profile] Get users error:', error.message);
      })

  }, [])


  return (
    <article>
      {user !== undefined
        ? <div className='profile'>
          <div><span>Name:</span> {user.firstName} {user.lastName}</div>
          <div><span>email:</span> {user.email}</div>
          <div><span>Day of birth:</span> {user.dayOfBirth?.toString()}</div>
          <div><span>Role:</span> {user.role}</div>
        </div>
        : <p>No users to display</p>
      }
    </article>
  )
}
