import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";


export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist }: any = useAuth();

  useEffect(() => {

    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    }

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    console.log('PersistLogin isLoading:', isLoading);
    console.log('PersistLogin auth.accessToken:', JSON.stringify(auth?.accessToken));
  }, [isLoading]);

  return (
    <>
      <Outlet />
      {/* {!persist
        ? <Outlet />
        : isLoading
          ? <p>Loading...</p>
          : <Outlet />
      } */}
    </>
  )
}
