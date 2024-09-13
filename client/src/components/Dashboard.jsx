import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  const {userInfo}=useSelector((state)=>state.user)

  console.log("user data",userInfo)

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // console.log("ser user",setUser)
      } catch (error) {
        console.error('Error parsing user data:', error);
        // navigate('/login');
      }
    } else {
      // navigate('/login');
    }
  }, [navigate]);

 
  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-white text-purple-800 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content */}
      <div className="flex justify-center items-center mt-20">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {user ? (
            <>
              <h2 className="text-2xl font-bold">Welcome, {user.firstName} {user.lastName}!</h2>
              <p className="mt-2 text-lg">Email: {user.email}</p>
            </>
          ) : (
            <p>Currently no data ! Please Login or Sign Up for data</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
