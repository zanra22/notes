import { privateInstance } from "../axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

export default function useAxiosPrivate(){

    const {access, setAccess, csrfToken, user} = useAuth()

    const refresh = useRefreshToken()

    useEffect(() => {
        const requestIntercept = privateInstance.interceptors.request.use(
            (config) => {
                if(!config.headers["Authorization"]){
                    config.headers["Authorization"] = `Bearer ${access}`
                    config.headers["X-CSRFToken"] = csrfToken
                }
            }
        )

        const responseIntercept = privateInstance.interceptors.response.use(
            response => response,
            async(error) => {
                const previousRequest = error?.config
                if(!previousRequest?.sent && (error?.response?.status === 401 || error?.response?.status === 403)){
                    previousRequest = true
                    const {access: newAccess, csrfToken: newCsrfToken} = await refresh()
                    setAccess(newAccess)
                    previousRequest.headers["Authorization"] = `Bearer ${newAccess}`
                    previousRequest.headers["X-CSRFToken"] = newCsrfToken

                    return privateInstance(previousRequest)
                }
                return Promise.reject(error)
            }
        )

        return () => {
            privateInstance.interceptors.request.eject(requestIntercept)
            privateInstance.interceptors.response.eject(responseIntercept)
        }

    }, [access, user])
    

    return privateInstance
}