'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../services/authService';
import { LoginSchema } from '../schemas/Login';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    try {
      const data: LoginSchema = await login(name, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('dictatorId', data.id);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 py-8">
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-3xl mb-6 text-center">Iniciar Sesión</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 bg-neutral-800 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 bg-neutral-800 rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
