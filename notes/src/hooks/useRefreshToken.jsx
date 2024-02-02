import { instance } from "../axios";
import useAuth from "./useAuth";

export default function useRefreshToken(){
    const {setAccess, setCsrfToken} = useAuth()

    const refresh = async() => {
        const response = instance.post('token/refresh/')
        setAccess(response.data.access)
        setCsrfToken((await response).headers["X-CSRFToken"])

        return {
            access: response.data.access,
            csrfToken: (await response).headers["X-CSRFToken"]
        }
    }

    return refresh
}