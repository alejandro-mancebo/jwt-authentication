import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";


export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist }: any = useAuth();

  console.log('PersistLogin persist start:', persist);
  console.log('PersistLogin auth.accessToken start:', auth?.accessToken);

  useEffect(() => {

    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        console.log('*********************************************')
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    }

    console.log('PersistLogin persist:', persist);
    console.log('PersistLogin auth.accessToken:', auth?.accessToken);
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
