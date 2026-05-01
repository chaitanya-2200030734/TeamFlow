import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const SignupPage = () => {
  const { registerOrganization, signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('join');
  const [form, setForm] = useState({ organizationName: '', organizationCode: '', name: '', email: '', password: '', confirmPassword: '' });

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      if (mode === 'create') {
        await registerOrganization({ ...payload, organizationName: form.organizationName });
      } else {
        await signup({ ...payload, organizationCode: form.organizationCode });
      }
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">TeamFlow</div>
        <h1>{mode === 'create' ? 'Register organization' : 'Join organization'}</h1>
        <div className="role-toggle">
          <button type="button" className={mode === 'join' ? 'selected' : ''} onClick={() => setMode('join')}>Join Org</button>
          <button type="button" className={mode === 'create' ? 'selected' : ''} onClick={() => setMode('create')}>Create Org</button>
        </div>
        {mode === 'create'
          ? <label>Organization Name<input required value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} /></label>
          : <label>Organization Invite Code<input required value={form.organizationCode} onChange={(e) => setForm({ ...form, organizationCode: e.target.value.toUpperCase() })} /></label>}
        <label>Name<input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
        <label>Confirm Password<input type={showPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></label>
        <Button>{mode === 'create' ? 'Create Organization Admin' : 'Join as Member'}</Button>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </main>
  );
};
