import { createContext, useState } from 'react';

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
    setAuth({ accessToken: auth.accessToken, user: { _id: auth._id, name: auth.name } });
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;

