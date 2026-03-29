import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            if (!token) throw new Error("No reset token found");
            const res = await api.resetPassword(token, { password }) as any;
            setStatus('success');
            setMessage(res.message || 'Password has been successfully reset.');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err: any) {
            console.error("Reset Password Error:", err);
            setStatus('error');
            setMessage(err.message || 'Failed to reset password. The link might be invalid or expired.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div>
                    <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-icons text-white">vpn_key</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Enter your new password below.
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
                                        Success!
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                                        <p>{message}</p>
                                        <p className="mt-2 text-xs">Redirecting to login...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                                Go to sign in now
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="new-password" className="sr-only">New Password</label>
                                <input
                                    id="new-password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
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
                                {status === 'loading' ? 'Updating...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
