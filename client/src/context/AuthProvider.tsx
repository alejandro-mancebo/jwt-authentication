// import * as React from 'react';
import { createContext, useState } from 'react';
// import useRefreshToken from '../hooks/useRefreshToken';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState({});
  const persistStore = localStorage.getItem("persist");

  console.log('AuthProvider auth:', auth);

  let persistValue;
  if (!persistStore) {
    persistValue = false;
  } else {
    persistValue = JSON.parse(persistStore);
  }

  const [persist, setPersist] = useState(persistValue);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;

