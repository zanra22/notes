import { privateInstance } from "../axios";
import useAuth from "./useAuth";

export default function useLogout() {
  const { setUser, setAccess, setCsrfToken } = useAuth();

  const logout = async () => {
    try {
      const response = await privateInstance.post("signout/");
      setAccess(null);
      setCsrfToken(null);
      setUser({});
    } catch (error) {
      console.log(error);
    }
  };
  return logout
}
