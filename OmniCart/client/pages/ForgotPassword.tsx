import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await api.forgotPassword({ email }) as any;
            setStatus('success');
            setMessage(res.message || 'Password reset link sent to your email.');
        } catch (err: any) {
            console.error("Forgot Password Error:", err);
            setStatus('error');
            setMessage(err.message || 'Failed to send reset link. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div>
                    <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-icons text-white">lock_reset</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="mt-8">
                        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="material-icons text-green-400">check_circle</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                                        Email sent successfully
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                                        <p>{message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                                Return to sign in
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {status === 'error' && (
                            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {message}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                        
                        <div className="text-center text-sm">
                            <Link to="/login" className="font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Back to sign in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
