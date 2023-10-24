
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext } from "react";
// import { AppContext } from "../../hooks/index";

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
  // const [user, setUser] = useState<User>()

  const navigate = useNavigate();
  // const authContext = useContext(AppContext);
  // console.log(authContext.loggedInUser);

  const form = useForm<User>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(UserFormData),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmitHandle = async (data: User) => {
    const url = `${import.meta.env.VITE_AUTH_URL}/auth`;

    if (data !== undefined) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(response.status);
      console.log(response);

      try {



        if (response.status === 201) {
          const data = await response.json();
          const token = data.token; // Assuming the token is in the response as 'token'

          // Now you have the token, and you can use it for further authentication or API requests
          console.log("Token: ", token, "User: ", data.username);
          // authContext.setLoggedInUser(data.username);
          // authContext.login(token);
          // navigate to home page
          navigate("/user-profile", {
            replace: true,
          });
        } else {
          // Handle other response statuses (e.g., display an error message)
          console.log("Error:", response.status);
        }

        form.reset();
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error:", error);
      }

    }
  };

  return (
    <>
      <div
        className=" max-w-md mx-auto p-2 overflow-hidden bg-hs-lightsteelblue md:max-w-5xl md:mx-auto md:rounded-xl md:m-4 md:p-10 md:max-h-screen lg:max-w-6xl lg:mx-auto xl:max-w-7xl xl:mx-auto ">
        <div className=" md:flex justify-between items-center ">
          <div
            className={` border-solid rounded-xl md:w-5/12 md:ml-10 md:px-10 `}
          >
            <div className={`w-[250px] mt-3 mb-16 mx-auto`}>
              <h1 className={` font-bold text-2xl text-center`}>
                Login
              </h1>

            </div>
            <form onSubmit={handleSubmit(onSubmitHandle)}>
              <div className={` my-0`}>
                <label className={`mb-6 `} htmlFor="username">
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
                  {...register("password")}
                />
                {errors.password?.message && (
                  <p className="errors">{errors.password?.message}</p>
                )}
                {/* Todo */}
                {/* <p className={` text-end mt-2 p-3 text-sm`}>
                  {" "}
                  <Link
                    className=" hover:text-hs-darkslategray hover:font-semibold transition ease-in-out duration-300 "
                    to="#"
                  >
                    Forgot your password
                  </Link>
                </p> */}
              </div>
              <div className={` mt-16 mb-4 text-center`}>
                <button
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
    </>
  );
}


