import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/resources');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Booking Platform</h1>
        <h2 className="text-xl text-center text-gray-600 mb-8 font-normal">Login</h2>
        
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <form onSubmit={handleSubmit} className="mb-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@acme.com"
            disabled={loading}
          />
          
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="admin123"
            disabled={loading}
          />
          
          <Button type="submit" isLoading={loading} className="w-full mt-2">
            Login
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 text-center">
          <p className="font-medium mb-2">Demo credentials:</p>
          <p>Admin: admin@acme.com / admin123</p>
          <p>User: user@acme.com / user123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
