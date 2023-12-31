import { createContext, useContext, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
// import { useCookies  } from 'react-cookie';

import axios from "axios"
const ParentContent = createContext()

export function useGlobal() {
	return useContext(ParentContent)
}

const ParentComponent = ({ children }) => {
    const apiInstance = axios.create({ baseURL: process.env.REACT_APP_ROOT_SERVER_URL, withCredentials: true, })
	const pathName = useLocation().pathname
	const navigate = useNavigate()
	const [isLoginLoading, setIsLoginLoading] = useState(true)
	const authApi = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL,
		withCredentials: true,
	})
	const [user, setUser] = useState(null)

	const getUser = () => {
		try {
			apiInstance
				.get("/auth/login/success")
				.then((response) => {
					setUser(response.data.user._json)
				})
				.catch((e) => {
					if(pathName.indexOf("") !== -1) navigate("/")
					setUser()
				}).finally(() => setIsLoginLoading(false))
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getUser()
	}, [])

	return (
		<ParentContent.Provider value={{ user, setUser, authApi, apiInstance, isLoginLoading }}>
			{children}
		</ParentContent.Provider>
	)
}

export default ParentComponent
