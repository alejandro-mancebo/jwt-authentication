import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";


export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refresh = useRefreshToken();
  const { auth, persist }: any = useAuth();


  useEffect(() => {

    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        const accessToken = await refresh();
        // console.log('[verifyRefreshToken] refresh:', accessToken);
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
    localStorage.setItem('isLoading', isLoading.toString());
    // console.log('[PersistLogin] isLoading:', isLoading);
    // console.log('[PersistLogin] auth:', auth);
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
