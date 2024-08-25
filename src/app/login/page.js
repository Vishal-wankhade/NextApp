// src/app/login/page.js
"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Get login function from context
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    // Set the logged-in user in context
      router.push('/Home');  // Redirect to the home page
    } catch (err) {
      alert(err.message)
      // setError(err.message);
    }
  };

  return (
    <div>
      <div className="p-10 border-[1px] -mt-5 border-slate-200 rounded-md flex flex-col items-center space-y-3 bg-white">
        <div className="py-2">
          <h1 className="p-5 text-black font-black text-3xl">Login</h1>
        </div>
        <input
          className="p-3 border-[1px] border-slate-500 rounded-sm w-80 text-black"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <div className="flex flex-col space-y-1">
          <input
            className="p-3 border-[1px] border-slate-500 rounded-sm w-80 text-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {/* <p className="font-bold text-[#0070ba]">Forgot password?</p> */}
        </div>
        <div className="flex flex-col space-y-5 w-full">
          <button
            className="w-full bg-[#0070ba] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#003087]"
            onClick={handleLogin}
          >
            Log in
          </button>
          {error && <p className='text-red'>{error}</p>}
        </div>
      </div>
    </div>
  );
}
