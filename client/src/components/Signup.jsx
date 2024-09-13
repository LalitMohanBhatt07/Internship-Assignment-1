import React, { useState } from 'react';
import signupImage from "../assets/signup.png"
import { useNavigate } from 'react-router-dom';
import {useForm} from 'react-hook-form'
import {useDispatch} from "react-redux"
import {setUser} from '../slices/userSlice.js'


function SignupForm() {
  const dispatch=useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const [error,setError]=useState('')
 
  const navigate = useNavigate();

  const {register,
    handleSubmit,
    formState:{errors}
  }=useForm();

  const onSubmit = async (data) => {
    try {
      console.log("data",data);
      const response = await fetch('https://internship-assignment-1-2apo.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      

      const responseData = await response.json();
      console.log("signup response ",response)
      if (response.ok) {
        dispatch(setUser(responseData.newUser))
        localStorage.setItem('user', JSON.stringify(responseData.newUser));
        navigate('/verify-otp', { state: { email: data.email } });
      } else {
        setError(responseData.message || 'Sign up failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error during signup:', error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-white overflow-hidden mt-5">
      <div className="flex bg-white shadow-lg rounded-lg w-4/5 overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-100 justify-center items-center h-40 mt-72">
          <img src={signupImage}/>
        </div>
        
        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-lg text-purple-800 mb-4 absolute -mt-[510px] ml-96 font-semibold">Sign Up</h2>
          <p className="text-3xl font-bold text-purple-900 mb-6">Let us Know!</p>

          {/* Form */}
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm outline-focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
                {...register('firstName', { required: 'First name is required' })}
              />
               {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Set Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
                {...register('password', { required: 'Password is required', minLength: 6 })}
              />
               {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-5"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Retype Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-5"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div>
              <label htmlFor="contactMode" className="block text-sm font-medium text-gray-700">Contact Mode</label>
              <select
                id="contactMode"
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
              />
               {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign Up
            </button>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}


          <div className="mt-5 text-right">
            <a href="/signin" className="text-sm text-purple-700 hover:underline">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
