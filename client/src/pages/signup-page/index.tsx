import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPublic } from "../../api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useController } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";

import { User } from "../../types/user.type";


const USER_REGEX = /^[a-zA-Z][a-zA-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]){8,24}/;

interface IUser extends User {
  confirmPassword: string;
}

interface IRoles {
  value: string;
  label: string;
}

const roleOptions: IRoles[] = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const UserFormData = z
  .object({
    firstName: z.string().trim().min(1, "Please enter your first name"),
    lastName: z.string().trim().min(1, "Please enter your last name"),
    email: z
      .string()
      .toLowerCase()
      .min(1, { message: "Please enter your email" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    dayOfBirth: z.string(),
    role: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export default function SignUpPage() {
  const [, setIsDisabled] = useState(false);

  const navigate = useNavigate();

  const form = useForm<IUser>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dayOfBirth: undefined,
      role: "user",
    },
    resolver: zodResolver(UserFormData),
  });

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const { field } = useController({ name: "role", control });

  const handleSelectChange = (option: IRoles | null) => {

    field.onChange(option?.value);

    if (option?.value == "admin") setIsDisabled(true);
    else setIsDisabled(false);

  };

  const onSubmitHandle = async (data: IUser) => {
    let newUser: User;

    if (data !== undefined) {
      newUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        dayOfBirth: data.dayOfBirth,
        role: data.role,
      };

      // Use axios
      await axiosPublic.post('/signup',
        JSON.stringify({ newUser }), {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        withCredentials: true
      })
        .then((response) => {
          if (response.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Success...",
              text: "You are register successfully!",
            });
            navigate("/login");
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
            console.error('Registration failed');
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
      <h1 >Sign Up</h1>

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
              <p className="errors">{errors.firstName?.message}</p>
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

        <label htmlFor="password">Password
          <input
            type="password"
            id="password"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="errors">{errors.password?.message}</p>
          )}
        </label>

        <label htmlFor="confirmPassword">Confirm Password
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className="errors">{errors.confirmPassword?.message}</p>
          )}
        </label>

        <div>
          <label htmlFor="role">Role
            <Select
              value={roleOptions.find(
                ({ value }) => value === field.value
              )}
              onChange={handleSelectChange}
              options={roleOptions}
              id="role"
            />
          </label>

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



        <button type="submit" >Sign Up</button>
      </form>
    </section>
  );
}
