import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'teamflow-admin' ? '/teamflow-admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">TeamFlow</div>
        <h1>Sign in</h1>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <Button disabled={submitting}>{submitting ? 'Signing in...' : 'Sign In'}</Button>
        <p>New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </main>
  );
};
