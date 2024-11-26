import axios from "axios";
import { useEffect, useReducer } from "react";
import { useState } from "react";
import React, { createContext } from "react";


//Set initial values for Auth Context
let initialAuthValues = {
    id: "",
    accessToken: "",
    email: "",
    refreshToken: "",
    isAuthenticated: false,
    logIn: (userInfo) => {},
    logOut: () => {},
    setRefreshTokenFunction: () => {},
};

let AuthContext = createContext(initialAuthValues);

export const AuthProvider = ({children}) => {

    //Set auth token
    let [authToken, setAuthToken] = useState(null);

    //Set email state
    let [email, setEmail] = useState(null);

    //Set refreshToken
    let [refreshToken, setRefreshToken] = useState(null);

    // Set organization id
    let [id, setId] = useState(null);
 
    //Log in user
    let logIn = async (userInfo, toast, reset, setDefaultValues, navigate) => {
        try {
        const response = await axios.post(import.meta.env.VITE_API_KEY + "/api/v1/auth/login", userInfo);

        const data = response?.data;

        setAuthToken(data?.accessToken);
        setId(data?._id);
        setEmail(data?.email);
        setRefreshToken(data?.refreshToken);
        sessionStorage.setItem("accessToken", JSON.stringify(data?.accessToken));
        sessionStorage.setItem("refreshToken", JSON.stringify(data?.refreshToken));
        sessionStorage.setItem("user", JSON.stringify(data));

        toast.success("Log in successfully!");

        reset();

        setDefaultValues({
          email: "",
          password: "",
        });

        navigate("/case-table");
        
        } catch (error) {
            toast.error(error?.response.data?.message);
        }
    };

    //Log out
    let logOut = async () => {
        setAuthToken(null);
        setEmail(null);
        setId(null);
        setRefreshToken(null);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("user");
    };

    // Set refresh token function
    let setRefreshTokenFunction = async () => {

        const refreshTokenFromSession = sessionStorage.getItem("refreshToken") ? JSON.parse(sessionStorage.getItem("refreshToken")) : null;

        if (refreshTokenFromSession) {
            let newAccessTokenAfterBeingRefreshed = "";
            try {
                const response = await axios.post(import.meta.env.VITE_API_KEY + "/api/v1/auth/getNewTokenFromRefreshToken", {
                    refreshToken: refreshTokenFromSession,
                });
                const data = response?.data;
                
                if (data?.accessToken && data?.refreshToken) {
                    setAuthToken(data?.accessToken);
                    setRefreshToken(data?.refreshToken);
                    sessionStorage.setItem("accessToken", JSON.stringify(data?.accessToken));
                    sessionStorage.setItem("refreshToken", JSON.stringify(data?.refreshToken));
                    newAccessTokenAfterBeingRefreshed = data?.accessToken;
                } else {
                    console.error("Something is wrong with tokens!");
                }
            } catch (error) {
                console.error(error);
            }

            return newAccessTokenAfterBeingRefreshed;
        } else {
            return null;
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("refreshToken") && sessionStorage.getItem("user")) {
            setAuthToken(JSON.parse(sessionStorage.getItem("accessToken")));
            setRefreshToken(JSON.parse(sessionStorage.getItem("refreshToken")));
            setEmail(JSON.parse(sessionStorage.getItem("user"))?.email);
            setId(JSON.parse(sessionStorage.getItem("user"))?._id);
        }
    }, []);

    return (<AuthContext.Provider value={{
        accessToken: authToken,
        id: id,
        email: email,
        isAuthenticated: !!authToken,
        refreshToken: refreshToken,
        logIn: logIn,
        logOut: logOut,
        setRefreshTokenFunction: setRefreshTokenFunction,
    }}>
        {children}
    </AuthContext.Provider>)
}

export default AuthContext;