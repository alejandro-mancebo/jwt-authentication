
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuth from "../../hooks/useAuth";
import { axiosPublic } from "../../api/axios";


type User = {
  email: string;
  password: string;
};


const UserFormData = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});


export default function LoginPage() {
  const { setAuth, persist, setPersist }: any = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  console.log('login page location from:', from);

  // console.log('LoginPage persist:', persist)

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

            setAuth({ user, password, role, accessToken });
            setPersist(true);

            localStorage.setItem("jwt", accessToken);
            localStorage.setItem("email", user.email);

            // navigate(from, { replace: true });
            navigate('/');
          }
        })
        .catch((errors) => {
          if (!errors?.response) {
            console.log('No server response');
          } else if (errors?.response.status === 400) {
            console.log('Missing username or password');
          } else if (errors?.response.status === 401) {
            console.log('Unauthorized');
          } else {
            console.log('Login failed');
          }
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
    <section>
      <div
        className=" max-w-md mx-auto p-2 overflow-hidden bg-hs-lightsteelblue md:max-w-5xl md:mx-auto md:rounded-xl md:m-4 md:p-10 md:max-h-screen lg:max-w-6xl lg:mx-auto xl:max-w-7xl xl:mx-auto ">
        <div className=" md:flex justify-between items-center ">
          <div className={` border-solid rounded-xl md:w-5/12 md:ml-10 md:px-10 `} >
            <div className={`w-[250px] mt-3 mb-16 mx-auto`}>
              <h1 className={` font-bold text-2xl text-center`}>
                Login
              </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmitHandle)}>
              <div className={` my-0`}>
                <label className={`mb-6 `} htmlFor="email">
                  email
                </label>
                <input
                  className={` rounded-md w-full px-4 py-2 mt-3 text-lg`}
                  type="email"
                  id="email"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="errors">{errors.email?.message}</p>
                )}
              </div>
              <div className={`  mt-8 `}>
                <label htmlFor="password">Password</label>
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
              </div>

              <div className="persistCheck">
                <input
                  type="checkbox"
                  id="persist"
                  onChange={togglePersist}
                  checked={persist}
                />
                <label htmlFor="persist">Trust This Device</label>

              </div>

              <div className={` mt-16 mb-4 text-center`}>
                <button type="submit"
                  className={`bg-hs-darkslategray text-hs-gainsboro text-lg  font-semibold w-3/4 mx-auto rounded-lg p-3`}
                >
                  Sign In
                </button>
              </div>
              <div>
                <p className={` text-center`}>
                  Don't have any account{" "}
                  <Link
                    className=" hover:text-hs-darkslategray hover:font-semibold transition ease-in-out    duration-300"
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}


