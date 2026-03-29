
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to where they came from or profile
    const from = location.state?.from?.pathname || '/profile';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            let res;
            if (isLogin) {
                res = await api.login({ email, password });
            } else {
                res = await api.register({ name, email, password });
            }
            // Both login and register return token + user
            if (res.token && res.user || res._id) {
                // Adjust based on what register logic returns. 
                // Backend: status(201).json({ _id, name, email, token })
                const token = res.token;
                const userData = { _id: res._id, name: res.name, email: res.email, ...res.user };
                login(token, userData);
                navigate(from, { replace: true });
            } else {
                setError('Unexpected response from server');
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            setError(err.message || 'Authentication failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div>
                    <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">O</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Or{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-primary hover:text-primary-dark transition-colors focus:outline-none"
                        >
                            {isLogin ? 'start your 14-day free trial' : 'sign in to your existing account'}
                        </button>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 ${isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark transition-colors">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <span className="material-icons text-primary-dark group-hover:text-white transition-colors text-sm">lock</span>
                            </span>
                            {isLogin ? 'Sign in' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
