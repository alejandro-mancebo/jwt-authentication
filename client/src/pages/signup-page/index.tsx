import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
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
    name: z.string().trim().nonempty("Please enter your name"),
    email: z
      .string()
      .nonempty("Please enter your email")
      .email({ message: "Please enter a valid email address " }),
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
      name: "",
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
    console.log("roleOption", option);

    field.onChange(option?.value);

    if (option?.value == "admin") setIsDisabled(true);
    else setIsDisabled(false);

    console.log("roleOption", option?.value);
  };

  const onSubmitHandle = async (data: IUser) => {
    let newUser: User;

    if (data !== undefined) {
      newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
        dayOfBirth: data.dayOfBirth,
        role: data.role,
      };

      // Use axios
      await axiosPrivate.post('/signup',
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
          if (!error?.response) {
            console.log('No server response');
          } else if (error?.response.status === 409) {
            console.log('User exist');
          } else {
            console.log('Registration failed');
          }
          Swal.fire({
            icon: "error",
            title: "fail...",
            text: "Failed to register!",
          });
        })
    }
  };


  return (
    <section>
      <div className=" max-w-md mx-auto p-2 overflow-hidden bg-hs-lightsteelblue md:max-w-5xl md:mx-auto  md:m-4 md:p-10 md:max-h-screen lg:max-w-6xl lg:mx-auto xl:max-w-7xl xl:mx-auto ">
        <div className={` md:flex justify-between `}>
          <div className={` border-solid rounded-xl md:w-5/12  md:ml-10 md:px-2 `} >
            <div className={`w-[250px] mt-3 mb-3 mx-auto`}>
              <h1 className={` font-bold text-2xl text-center`}>Sign Up</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmitHandle)}>
              <div className=" overflow-auto  md:h-[calc(100vh-21rem)] pr-4 ">
                <div className={` my-0`}>
                  <label className={`mb-6 `} htmlFor="name">
                    Name
                  </label>
                  <input
                    className={` rounded-md w-full px-4 py-2 mt-3 text-lg`}
                    type="text"
                    id="name"
                    autoComplete="off"
                    {...register("name")}
                  />
                  {errors.name?.message && (
                    <p className="errors">{errors.name?.message}</p>
                  )}
                </div>
                <div className={` my-4`}>
                  <label className={`mb-6 `} htmlFor="email">
                    email
                  </label>
                  <input
                    className={` rounded-md w-full px-4 py-2 mt-3 text-lg`}
                    type="email"
                    id="email"
                    autoComplete="off"
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="errors">{errors.email?.message}</p>
                  )}
                </div>
                <div className={` mt-4 `}>
                  <label htmlFor="password">Password</label>
                  <input
                    className={` rounded-md w-full px-4 py-2 mt-3 text-lg`}
                    type="password"
                    id="password"
                    {...register("password")}
                  />
                  {errors.password?.message && (
                    <p className="errors">{errors.password?.message}</p>
                  )}
                </div>
                <div className={`  mt-4 `}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    className={` rounded-md w-full px-4 py-2 mt-3 text-lg`}
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword?.message && (
                    <p className="errors">{errors.confirmPassword?.message}</p>
                  )}
                </div>
                <div className={`  mt-4 `}>
                  <label htmlFor="role">Role</label>
                  <Select
                    value={roleOptions.find(
                      ({ value }) => value === field.value
                    )}
                    onChange={handleSelectChange}
                    options={roleOptions}
                    id="role"
                  />
                </div>

                <div className={`mt-4`}>
                  <div className={`flex items-end justify-between `}>
                    <div className={` `}>
                      <label htmlFor="dayOfBirth">Day of Birth</label>
                      <input
                        className={` rounded-md w-40 md:w-56 px-4 py-2 mt-3 text-lg`}
                        type="date"
                        id="dayOfBirth"
                        {...register("dayOfBirth")}
                      />
                    </div>
                  </div>

                  <div className={`flex items-end justify-between `}>
                    <div>
                      {errors.dayOfBirth?.message && (
                        <p className="errors">{errors.dayOfBirth?.message}</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className=" my-4 text-center ">
                <button
                  className="bg-hs-darkslategray text-hs-gainsboro text-lg  font-semibold w-3/4 mx-auto rounded-lg p-3 "
                  type="submit"
                >
                  Sign Up
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
