import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { Logo } from '@/components/Logo';

export default function AdminLogin() {
  const { signIn, signUp } = useAuth();
  const { navigate } = useRouter();
  const { settings } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else if (mode === 'signin') {
      navigate('/admin');
    } else {
      setError('Account created! You can now sign in.');
      setMode('signin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ backgroundColor: bg }}>
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] animate-pulse-slow" style={{ background: `${primary}25` }} />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[120px] animate-pulse-slow" style={{ background: `${accent}25` }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: `'${headingFont}', sans-serif` }}>
            {mode === 'signin' ? 'Admin Login' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm">
            {mode === 'signin' ? 'Sign in to manage your agency website' : 'Sign up to access the admin dashboard'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="admin@cupidcreativex.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
              style={{ background: `linear-gradient(to right, ${primary}, ${primary}dd)` }}
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}
