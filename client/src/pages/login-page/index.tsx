
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuth from "../../hooks/useAuth";
import { axiosPublic } from "../../api/axios";
import Swal from "sweetalert2";

type User = {
  email: string;
  password: string;
};


const UserFormData = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});


export default function LoginPage() {
  const { setAuth, persist, setPersist }: any = useAuth();
  const navigate = useNavigate();

  const form = useForm<User>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(UserFormData),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmitHandle = async (user: User) => {

    if (user !== undefined) {
      // Use axios
      await axiosPublic.post('/auth',
        JSON.stringify({ user }), {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        withCredentials: true
      })
        .then((response) => {
          if (response.status === 201) {

            const accessToken = response.data.accessToken;
            const user = response.data.user;
            const { password, role } = user;

            axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            setAuth({ user, password, role, accessToken });
            setPersist(true);
            localStorage.setItem('username', user.firstName);

            // navigate(from, { replace: true });
            navigate('/');
          }
        })
        .catch((errors) => {
          let errorMessage;
          if (!errors?.response) {
            errorMessage = 'No server response';
            console.error('No server response');
          } else if (errors?.response.status === 400) {
            errorMessage = 'Missing username or password';
            console.error('Missing username or password');
          } else if (errors?.response.status === 401) {
            errorMessage = 'Unauthorized';
            console.error('Unauthorized');
          } else {
            errorMessage = 'Login failed';
            console.error('Login failed');
          }
          Swal.fire({
            icon: "error",
            title: "Fail...!!!",
            text: errorMessage
          });
        });
    }
  };


  const togglePersist = () => {
    setPersist((prev: any) => !prev);
  }


  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist])


  return (
    <section id="login">
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <label htmlFor="email">email
          <input
                  type="email"
                  id="email"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="errors">{errors.email?.message}</p>
                )}
        </label>

        <label htmlFor="password">Password
                <input
                  className={` rounded-md w-full px-4 py-2 mt-3 text-lg`}
                  type="password"
                  id="password"
                  autoComplete="false"
                  {...register("password")}
                />
                {errors.password?.message && (
                  <p className="errors">{errors.password?.message}</p>
                )}
        </label>

        <label htmlFor="persist">
                <input
                  type="checkbox"
                  id="persist"
                  onChange={togglePersist}
                  checked={persist}
                />
          &nbsp;Trust This Device
        </label>

        <button type="submit">Sign In</button>

        <p className={` text-center`}>
          Don't have any account &nbsp;
          <Link to="/signup">
            Sign Up
          </Link>
        </p>

      </form>

    </section>
  );
}


