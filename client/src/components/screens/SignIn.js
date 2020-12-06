import React, { useContext, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import './Sign.css'
import M from 'materialize-css';

import { userContext } from '../../App';


const SignIn = () => {
    const {dispatch} = useContext(userContext);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const PostData = async () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({html: "invalid email", classes:"#c62828 red darken-3"})
        }
        await fetch('/signin', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                password,
                email,
            })
        }).then(res => res.json())
        .then((data) => {
            console.log(data)
            if(data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else {
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("svuser",JSON.stringify(data.svuser))

                dispatch({type:"USER", payload:data.svuser});

                M.toast({html: "signedin success", classes:"#43a047 green darken-1"});
                history.push('/');
            }
        })
        .catch(err => {
            console.log(err)
        });
    }
    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
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
