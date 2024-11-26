import axios from 'axios';
import getEnvironments from '../utils/GetEnv';

// Set up axios instance to handle with access token and refresh token

const createAxiosInstance = ({setRefreshTokenFunction, logOut}) => {

const axiosInstance = axios.create({
    baseURL: "https://back-end-contact-form-thesis-2025.onrender.com",
    headers: {
      'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {

      const accessTokenFromSession = sessionStorage.getItem("accessToken") ? JSON.parse(sessionStorage.getItem("accessToken")) : null;
      if (accessTokenFromSession) {
        config.headers['Authorization'] = `Bearer ${accessTokenFromSession}`;
      }
      return config;
      
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response.status === 401 && !originalRequest._retry) {
        
        try {
          const newAccessTokenAfterBeingRefreshed = await setRefreshTokenFunction();

          if (newAccessTokenAfterBeingRefreshed == null) {
            logOut();
            return Promise.reject(error);
          }
          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessTokenAfterBeingRefreshed}`;
          originalRequest._retry = true;
          
          return;
        } catch (err) {
          logOut();
          return Promise.reject(err);
        }
      }

      if (error.response.status === 401 && originalRequest._retry) {

        const newAccessTokenAfterBeingRefreshed = await setRefreshTokenFunction();

        if (newAccessTokenAfterBeingRefreshed == null) {
          logOut();
          return Promise.reject(error);
        }
          
        originalRequest.headers['Authorization'] = `Bearer ${newAccessTokenAfterBeingRefreshed}`;
        originalRequest._retry = true;
        return;
      }

      return Promise.reject(error);;
    }
);

  return axiosInstance;
}


export default createAxiosInstance;