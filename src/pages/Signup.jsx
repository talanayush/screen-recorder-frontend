import React, { useState } from 'react';
import API from '../api';

export default function Signup({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4">Sign Up</h2>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Name"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength={6}
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="submit">Sign Up</button>
    </form>
  );
}
