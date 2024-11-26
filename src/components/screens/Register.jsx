import { TextField } from '@mui/material';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { inputSanitization } from '../utils/Sanitization';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  
    //Set navigate
  const navigate = useNavigate();

  const [defaultValues, setDefaultValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Set yup validation schema for validation
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .max(100, "Username is too long")
      .required("Username is required"),
    email: Yup.string()
      .max(100, "Username is too long")
      .email("Email is in incorrect format")
      .required("Email is required"),
    password: Yup.string()
      .max(100, "Password is too long")
      .required("Password is required"),  
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: defaultValues,
      mode: "onChange",
      shouldFocusError: false
    });

    //Handle submit

    const onSubmit = async (data) => {
      let dataSubmittedForBackend = {
        username: inputSanitization(data?.username),
        email: inputSanitization(data?.email),
        password: inputSanitization(data?.password),
      }
      
      try {

        await axios.post(import.meta.env.VITE_API_KEY + "/api/v1/auth/register", dataSubmittedForBackend);

        toast.success("Register an organization successfully! Please log in!");

        navigate("/");

        reset();
        setDefaultValues({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        })

      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }     
    } 

  
  return (
    <div className="flex w-full h-screen bg-indigo-600">
    <div className="w-full flex items-center justify-center lg:w-1/2">
      <div className=" w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
        <h1 className="text-5xl font-semibold">Register</h1>
        <p className="font-medium text-lg text-gray-500 mt-4">
          Welcome back, please sign up.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8">
          <div className="flex flex-col">
            <label className="text-lg font-medium mt-1"> Username </label>
            <TextField
              name="username"
              label="Username"
              defaultValue={defaultValues?.username ?? false}
              helperText={errors?.username ? errors?.username?.message :  ""}
              {...register("username")}
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'red', 
                },
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-medium mt-1">Email</label>
            <TextField
              name="email"
              label="Email"
              defaultValue={defaultValues?.email ?? false}
              helperText={errors?.email ? errors?.email?.message :  ""}
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
            <label className="text-lg font-medium mt-1">Password</label>
            <TextField
              name="password"
              label="Password"
              type='password'
              defaultValue={defaultValues?.password ?? false}
              helperText={errors?.password ? errors?.password?.message :  ""}
              {...register("password")}
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'red',
                },
              }}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label className="text-lg font-medium mt-1">Confirm Password</label>
            <TextField
              name="confirmPassword"
              type='password'
              label="Confirm password"
              defaultValue={defaultValues?.confirmPassword ?? false}
              helperText={errors?.confirmPassword ? errors?.confirmPassword?.message :  ""}
              {...register("confirmPassword")}
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
              type="submit"
            >
              Register
            </button>
           
          </div>
          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">You have an account?</p>
            <Link to="/">
            <button
              
              className="ml-2 font-medium text-base text-sky-500"
            >
              Sign in
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

export default Register