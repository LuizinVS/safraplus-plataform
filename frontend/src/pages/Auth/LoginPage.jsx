import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validationSchemas';
import { login as authLogin } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await authLogin(data);
      // Assumindo que a resposta contém um token JWT diretamente.
      // Se for um objeto { token: '...', user: {...} }, ajuste aqui.
      login(response.token || response.data.token);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acessar sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou <Link to="/register" className="font-medium text-primary hover:text-primary-dark">registre-se aqui</Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Endereço de e-mail"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Senha"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;