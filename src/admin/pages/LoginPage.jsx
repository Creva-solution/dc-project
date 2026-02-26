import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const { signIn, user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // If already logged in, redirect away from login page
    if (user) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }

        setLoading(true);

        const { error } = await signIn({ email, password });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Welcome back, Admin");
            navigate('/admin/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-center items-center p-4">

            {/* Logo area */}
            <div className="mb-10 text-center animate-fade-in">
                <img src="/images/dc-logo.svg" alt="DC Constructions Logo" className="h-[60px] mx-auto mb-4 drop-shadow-sm" />
                <h1 className="text-2xl font-black text-primary tracking-tight">Admin Dashboard Core</h1>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 pt-10 relative overflow-hidden animate-slide-up">

                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>

                <div className="relative z-10 mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h2>
                    <p className="text-sm font-medium text-gray-400 mt-2">Secure access for authorized personnel only.</p>
                </div>

                <form onSubmit={handleLogin} className="relative z-10 space-y-5">

                    <div className="space-y-1.5 pt-2">
                        <label className="text-sm font-bold text-gray-700 block">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-medium text-gray-900"
                                placeholder="admin@dcconstructions.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 pb-2">
                        <label className="text-sm font-bold text-gray-700 block">Root Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-medium text-gray-900 tracking-wider"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 px-4 flex items-center justify-center gap-2 rounded-xl transition hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Authenticating...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} /> Access Control Panel
                            </>
                        )}
                    </button>

                </form>

                <div className="mt-8 text-center text-xs font-semibold text-gray-400 relative z-10">
                    <p>Protected by Supabase Auth Gateway.</p>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
