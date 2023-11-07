import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
// import useRefreshToken from '../../hooks/useRefreshToken';

export const UserProfile = () => {

  const [users, setUsers] = useState<any>();
  const axiosPrivate = useAxiosPrivate();
  // const refresh = useRefreshToken();


  useEffect(() => {
    axiosPrivate.get('/user/653b2bb62eb108a05e8c0b27', {
      withCredentials: true,
    })
      .then((response) => {
        console.log('users list:', users)
        setUsers(response.data);
      })
      .catch(error => {
        console.log('Get users error:', error);
      })

  }, [])


  // useEffect(() => {
  // let isMounted = true;
  // const controller = new AbortController();

  // const getUsers = async () => {

  // try {
  //   const response = await axiosPrivate.get('/users', {
  //     withCredentials: true,
  // signal: controller.signal
  // });
  // isMounted && setUsers(response.data);
  //   } catch (error: any) {
  //     console.log('Get users error:', error);
  //   }
  // }

  // getUsers();

  // return () => {
  //   isMounted = false;
  //   controller.abort();
  // }

  // }, []);

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
