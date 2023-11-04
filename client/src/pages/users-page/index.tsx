import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
// import useRefreshToken from '../../hooks/useRefreshToken';

export default function UsersPage() {
  const [users, setUsers] = useState<any>();
  const axiosPrivate = useAxiosPrivate();
  // const refresh = useRefreshToken();

  useEffect(() => {
    // let isMounted = true;
    // const controller = new AbortController();

    const getUsers = async () => {

      try {
        const response = await axiosPrivate.get('/users', {
          withCredentials: true,
          // signal: controller.signal
        });
        // isMounted && setUsers(response.data);
      } catch (error: any) {
        console.log('Get users error:', error);
      }
    }

    getUsers();

    // return () => {
    //   isMounted = false;
    //   controller.abort();
    // }

  }, []);

  return (
    <article>
      <h2>Users List</h2>
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

      {/* <button type="button" onClick={() => refresh()}>refresh</button> */}
    </article>
  )
}
