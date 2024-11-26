import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from '@mui/material';
import { inputSanitization } from '../utils/Sanitization';
import { toast } from 'react-toastify';

function Login() {
  
  // Get Auth Context
  let { logIn, isAuthenticated } = useContext(AuthContext);

   // Set effect directed to screen view if login is enabled already
   useEffect(() => {

    if (isAuthenticated) {
      navigate("case-table");
    }
  }, [isAuthenticated]);

  const [defaultValues, setDefaultValues] = useState({
    email: "",
    password: "",
  });

  //Set yup schema for validation
  const validationSchema = Yup.object().shape({
    email: Yup.string()
        .max(100, "Email is too long")
        .email("Email is in incorrect format")
        .required("Email is required"),
    password: Yup.string()
        .max(100,'Password is too long')
        .required("Password is required"),
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: defaultValues,
      mode: "onChange",
      shouldFocusError: false
    });

    // Set navigation
    const navigate = useNavigate();

    // Function to handle submit
    const onSubmit = async (data) => {
      let dataSubmittedForBackend = {
        email: inputSanitization(data?.email),
        password: inputSanitization(data?.password),
      }

      logIn(dataSubmittedForBackend, toast, reset, setDefaultValues, navigate);
  };

  return (
    <div className="flex w-full h-screen bg-indigo-600">
    <div className="w-full flex items-center justify-center lg:w-1/2">
      <div className=" w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
        <h1 className="text-5xl font-semibold"> Contact Form Demo </h1>
        <p className="font-medium text-lg text-gray-500 mt-4">
          Welcome back, please sign in.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8">
          <div className="flex flex-col">
            <label className="text-lg font-medium mb-2"> Email </label>
            <TextField
              name="email"
              label="Email"
              defaultValue={defaultValues?.email ?? false}
              helperText={errors?.email ? errors?.email?.message : ""}
              {...register("email")}
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'red', 
                },
              }}
            />
           
          </div>
          <div className="flex flex-col mt-4">
            <label className="text-lg font-medium mb-2">Password</label>
            <TextField
              name="password"
              type="password"
              label="Password"
              defaultValue={defaultValues?.password ?? false}
              helperText={errors?.password ? errors?.password?.message : ""}
              {...register("password")}
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'red',
                },
              }}
            />
          </div>
         
          <div className="mt-8 flex flex-col gap-y-4">
            <button
              className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-4 bg-sky-500 rounded-xl text-white font-bold text-lg"
              type='submit'
            >
              Sign in
            </button>
           
          </div>
          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">Don't have an account?</p>
            <Link to="/register">
            <button
              
              className="ml-2 font-medium text-base text-sky-500"
            >
              Sign up
            </button>
            </Link>
          </div>
        </div>
        </form>
      </div>
    </div>
    <div className="hidden relative w-1/2 h-full lg:flex items-center justify-center bg-gray-200">
      <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 animate-spin" />
      <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
    </div>
  </div>
  )
}

export default Login