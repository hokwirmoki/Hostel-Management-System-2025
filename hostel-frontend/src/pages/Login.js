

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            // If we were redirected to login, go back to the original page
            const from = location.state?.from?.pathname;
            if (from) {
                // If original route requires admin but user isn't admin, fall back to home
                if (from === '/admin' && response.user.role !== 'admin') {
                    navigate('/', { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
                return;
            }

            // Otherwise default based on role
            if (response.user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };
    return (
        <div className="auth-page">
            <div 
                className="auth-overlay"
                aria-hidden="true"
            />
            <div className="auth-wrapper container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                        <div className="auth-card card">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Login</h2>
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        Login
                                    </button>
                                </form>
                                <div className="mt-3 text-center text-muted">
                                    Don't have an account? <Link to="/register">Register here</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}