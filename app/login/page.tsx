"use client"

import { useState } from 'react';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import styles from './Auth.module.css';

import Navbar from '../Navbar';

export default function AuthPanel() {
    const [activeTab, setActiveTab] = useState('login');
    const [error, setError] = useState('');
    const [loginerror, setLoginError] = useState('');
    const [success, setSuccess] = useState('');
    const [loginsuccess, setLoginSuccess] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.success) {
            console.log('Login successful!');
            localStorage.setItem('userId', data.userId); // store the user id in storage
            localStorage.setItem('token', data.token);
            setError("");
            setLoginSuccess("Login successful!");
            window.location.href = '/';
        } else {
            console.log('Login failed!');
            setLoginError("Incorrect username or password.");
            return;
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const username = event.target.username.value;
        const password = event.target.password.value;
        const conf_password = event.target.conf_password.value;
        const email = event.target.email.value;
        const phoneNumber = event.target.phoneNumber.value;

        console.log(`here: ${JSON.stringify({ firstName, lastName, username, password, conf_password, email, phoneNumber })}`);

        // Check if any fields are empty
        if (!firstName || !lastName || !username || !password || !conf_password || !email || !phoneNumber) {
            setError("All fields are required.");
            return;
        }

        if (password !== conf_password) {
            setError("Passwords do not match.");
            return;
        }

        const response = await fetch('http://localhost:4000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, username, password, email, phoneNumber }),
        });

        if (!response.ok) {
            console.error('Signup failed');
            return;
        }

        const data = await response.json();

        if (data.success) {
            console.log('Signup successful!');
            setError("");
            setSuccess("Signup successful!");
            window.location.href = '/';
        } else {
            console.log('Signup failed!');
        }
    };

    return (
        <div className="home-container">
            <Navbar />
            <div className={styles.contentbody}>
                <div className={styles.contentBox}>
                    <div className={`${styles.authPanel} mt-3`}>
                        <div className={`${styles.row} row`}>
                            <ul className="nav nav-tabs pe-0" id="authTabs">
                                <li className={`nav-item ${styles.navItem}`}>
                                    <a
                                        className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                                        id="login-tab"
                                        onClick={() => setActiveTab('login')}
                                        href="#login"
                                    >
                                        Login
                                    </a>
                                </li>
                                <li className={`nav-item ${styles.navItem}`}>
                                    <a
                                        className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                                        id="signup-tab"
                                        onClick={() => setActiveTab('signup')}
                                        href="#signup"
                                    >
                                        Sign Up
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className={`${styles.row} row px-4`}>
                            <div className="tab-content mt-3 p-0" id="authTabsContent">
                                {activeTab === 'login' && (
                                    <div className="tab-pane fade show active" id="login" role="tabpanel">
                                        <div className="d-flex flex-column align-items-center w-100">
                                            <h4 className="mt-3 mb-3">
                                                Sign In to Squirtle
                                            </h4>

                                            <form method="post" className="w-100" onSubmit={handleLogin}>
                                                <p><input type="text" placeholder="Username:" name="username" id="id_username" className={styles.formInput} /></p>
                                                <p><input type="password" placeholder="Password:" name="password" id="id_password" className={styles.formInput} /></p>
                                                <button type="submit" name="login-btn" className="btn btn-info w-100 mt-4 mb-4">Login</button>
                                                {loginerror && <div className={styles.errorBox}>{loginerror}</div>}
                                                {loginsuccess && <div className={styles.successBox}>{loginsuccess}</div>}
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'signup' && (
                                    <div className="tab-pane fade show active" id="signup" role="tabpanel">
                                        <div className="d-flex flex-column align-items-center w-100">
                                            <h4 className="mt-3 mb-3">
                                                Sign Up to Squirtle
                                            </h4>
                                            <form method="post" className="w-100" onSubmit={handleSignup}>
                                                <p><input type="text" placeholder="First Name:" name="firstName" id="id_firstname" className={styles.formInput} /></p>
                                                <p><input type="text" placeholder="Last Name:" name="lastName" id="id_lastname" className={styles.formInput} /></p>
                                                <p><input type="email" placeholder="Email:" name="email" id="id_email" className={styles.formInput} /></p>
                                                <p><input type="tel" placeholder="Phone Number:" name="phoneNumber" id="id_phoneNumber" className={styles.formInput} /></p>
                                                <p><input type="text" placeholder="Username:" name="username" id="id_username" className={styles.formInput} /></p>
                                                <p><input type="password" placeholder="Password:" name="password" id="id_password" className={styles.formInput} /></p>
                                                <p><input type="password" placeholder="Confirm Password:" name="conf_password" id="id_conf_password" className={styles.formInput} /></p>
                                                <button type="submit" name="signup-btn" className="btn btn-info w-100 mt-4 mb-4">Sign Up</button>
                                                {error && <div className={styles.errorBox}>{error}</div>}
                                                {success && <div className={styles.successBox}>{success}</div>}
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
