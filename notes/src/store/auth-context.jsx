import { useState, createContext } from "react";

export const AuthContext = createContext({
  user: {},
  setUser: () => {},
  access: null,
  setAccess: () => {},
  refresh: null,
  setRefresh: () => {},
  csrfToken: null,
  setCsrfToken: () => {},
});

export function AuthContextProvider(props) {
  const [user, setUser] = useState({});
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        access,
        setAccess,
        refresh,
        setRefresh,
        csrfToken,
        setCsrfToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext