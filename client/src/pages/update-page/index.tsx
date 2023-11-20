import { useNavigate } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { User } from "../../types/user.type";
import { useState } from "react";


// const USER_REGEX = /^[a-zA-Z][a-zA-z0-9-_]{3,23}$/;
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]){8,24}/;


const UserFormData = z
  .object({
    firstName: z.string().trim().min(1, "Please enter your first name"),
    lastName: z.string().trim().min(1, "Please enter your last name"),
    email: z
      .string()
      .toLowerCase()
      .min(1, { message: "Please enter your email" })
      .email({ message: "Please enter a valid email address" }),
    dayOfBirth: z.string(),
  })

export default function UpdatePage() {
  const axiosPrivate = useAxiosPrivate();
  const auth: any = useAuth();
  const navigate = useNavigate();
  const [, setUser] = useState<User>();
  const [id, setId] = useState<string>();


  const form = useForm({
    defaultValues: async () => {

      let id = localStorage.getItem('_id');
      if (!id) {
        id = auth.auth._id
      }

      setId(id!);

      return axiosPrivate.get(`/users/${id}`, {
        withCredentials: true,
      })
        .then((response) => {

          setUser(response.data);
          localStorage.removeItem('_id');
          return {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            dayOfBirth: response.data.dayOfBirth
          }
        })
        .catch(error => {
          console.error('[UserProfile] Get users error:', error);
        })
    },
    resolver: zodResolver(UserFormData),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmitHandle = async (data: User) => {
    let user: User;

    if (data !== undefined && id) {
      user = {
        _id: id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        dayOfBirth: data.dayOfBirth,
        role: data.role,
      };

      // Use axios
      await axiosPrivate.put('/users', { user }, {
        withCredentials: true
      })
        .then((response) => {
          if (response.status === 201) {
            localStorage.setItem('username', user.firstName);
            Swal.fire({
              icon: "success",
              title: "Success...",
              text: "You are updated successfully!",
            });
            navigate("/users");
          }
        })
        .catch((error) => {
          let errorMessage;
          if (!error?.response) {
            errorMessage = 'No server response';
            console.error('No server response');
          } else if (error?.response.status === 409) {
            errorMessage = 'User exist';
            console.error('User exist');
          } else {
            errorMessage = 'Registration failed'
            console.error('Registration failed', error);
          }
          Swal.fire({
            icon: "error",
            title: "Fail...!!!",
            text: errorMessage
          });
        })
    }
  };


  return (
    <section id="signup">
      <h1 >Update</h1>

      <form onSubmit={handleSubmit(onSubmitHandle)}>

        <div>
          <label htmlFor="firstName"> First name
            <input
              type="text"
              id="firstName"
              autoComplete="off"
              {...register("firstName")}
            />
            {errors.firstName?.message && (
              <p className="errors">{errors.firstName.message}</p>
            )}
          </label>

          <label htmlFor="lastName"> Last name
            <input
              type="text"
              id="lastName"
              autoComplete="off"
              {...register("lastName")}
            />
            {errors.lastName?.message && (
              <p className="errors">{errors.lastName?.message}</p>
            )}
          </label>
        </div>


        <label htmlFor="email"> email
          <input
            type="email"
            id="email"
            autoComplete="off"
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="errors">{errors.email?.message}</p>
          )}
        </label>

        <div>
          <label htmlFor="dayOfBirth">Day of Birth
            <input
              type="date"
              id="dayOfBirth"
              {...register("dayOfBirth")}
            />
            {errors.dayOfBirth?.message && (
              <p className="errors">{errors.dayOfBirth?.message}</p>
            )}
          </label>
        </div>

        <button type="submit" >Submit</button>

      </form>
    </section>
  );
}
