import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminLogin } from '../../utils/api';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await adminLogin({
        username: data.username,
        password: data.password
      });

      // Salvar token no localStorage
      localStorage.setItem('clothes_admin_token', response.token);
      localStorage.setItem('clothes_admin_user', JSON.stringify(response.admin));

      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Erro ao fazer login';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tertiary/20 via-background to-secondary/10 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <img
            src="/assets/logo-ac.webp"
            alt="Clothes Shop"
            className="h-20 w-auto mx-auto mb-4"
          />
          <p className="text-text/60">Painel Administrativo</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-text mb-6 text-center">
            Acesso Administrativo
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo Username */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Usuário
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Digite seu usuário"
                  {...register('username', {
                    required: 'Usuário é obrigatório'
                  })}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-primary/20'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Campo Password */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Senha
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter no mínimo 6 caracteres'
                    }
                  })}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-primary/20'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={20} />
                  Entrando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>

          {/* Footer Info */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Acesso restrito. Apenas administradores autorizados.
          </p>
        </div>

        {/* Background Decoration */}
        <div className="mt-8 text-center">
          <div className="inline-block">
            <div className="w-12 h-12 bg-tertiary/30 rounded-full blur-xl opacity-50"></div>
            <div className="w-12 h-12 bg-primary/30 rounded-full blur-xl opacity-50 transform translate-x-8 -translate-y-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
