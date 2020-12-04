import React from "react";
import { Link } from 'react-router-dom';
import './Sign.css'
const SignIn = () => {
    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" />
                <input type="text" placeholder="password" />
                <button
                    className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                >
                    Submit
                </button>
                <h5>
                    <Link to="/signup">Don't have an account ?</Link>
                </h5>
            </div>
        </div>
    );
};

export default SignIn;
