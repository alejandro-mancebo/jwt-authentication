import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export const Users = () => {

  const [users, setUsers] = useState<any>();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate.get('/users', {
      withCredentials: true,
    })
      .then((response) => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log('Get users error:', error);
      })
  }, []);


  return (
    <article>
      {users !== undefined
        ? (
          <ul>
            {users.map((user: any, index: number) => (
              <li key={index}>{user?.email}</li>
            ))}
          </ul>
        ) : (
          <p>No users to display</p>
        )
      }
    </article>
  )
}
