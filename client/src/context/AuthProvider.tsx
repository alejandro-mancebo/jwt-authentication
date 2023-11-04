// import * as React from 'react';
import { createContext, useState } from 'react';
// import useRefreshToken from '../hooks/useRefreshToken';


const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<any>({});

  const persistStore = localStorage.getItem("persist");
  let persistValue;
  if (!persistStore) {
    persistValue = false;
  } else {
    persistValue = JSON.parse(persistStore);
  }
  const [persist, setPersist] = useState(persistValue);


  if (persist && Object.keys(auth).length === 0) {
    const authStore = localStorage.getItem("jwt");
    const emailStore = localStorage.getItem("email");
    setAuth({ accessToken: authStore, user: { email: emailStore } });
  }


  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;

