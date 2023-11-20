import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

export const Users = () => {

  const [users, setUsers] = useState<any>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    axiosPrivate.get('/users', {
      withCredentials: true,
    })
      .then((response) => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('[Users page] Get users error:', error);
      })
  }, []);


  const handleUpdate = (id: string) => {
    localStorage.setItem('_id', id);
    navigate('/update')
  }

  const handleDelete = (id: string) => {

    axiosPrivate.delete(`/users/${id}`, {
      withCredentials: true,
    },)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success...",
            text: "User was deleted successfully!",
          });
          window.location.reload();
          return false;
          // navigate();
        }
      })
      .catch(error => {
        console.error('[Users page] Error deleting user:', error.message);
        Swal.fire({
          icon: "error",
          title: "Fail...!!!",
          text: error.message
        });
      })
  }


  return (
    <article>
      {users !== undefined
        ? (
          <ul>
            {users.map((user: any, index: number) => (
              <li key={index} style={{ fontWeight: user?.role === 'admin' ? 400 : 300 }} >
                <div>{user?.firstName} {user?.lastName} [ {user?.role} ]  </div>
                <div className="update-delete">
                  <button type="button" className="update"
                    onClick={() => handleUpdate(user?._id)}>Edit</button>
                  <button type="button" className="delete"
                    onClick={() => handleDelete(user?._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users to display</p>
        )
      }
    </article>
  )
}
