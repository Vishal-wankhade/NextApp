// src/app/page.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from './login/page';
import Signup from './signup/page';
 // Import AuthProvider

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/Home');  
    }
  }, [isLoggedIn, router]);

  const [logCom, setLogCom] = useState(true);
  const [signCom, setSignCom] = useState(false);

  function handleLog() {
    setLogCom(true);
    setSignCom(false);
  }
  
  function handleSign() {
    setLogCom(false);
    setSignCom(true);
  }

  return (
     
      <main className="flex min-h-screen flex-col items-center justify-between p-24 main">
        <div className="bg-white mt-10">
          <div className="text-black flex justify-evenly m-6">
            <button type="button" 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"  
              onClick={handleLog}
            >
              Login
            </button>
            <button type="button" 
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleSign}
            > 
              SignUp
            </button>
          </div>
          {logCom ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Signup />}
        </div>
      </main>

  );
}
