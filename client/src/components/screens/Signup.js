import React, { useEffect, useState } from "react";
import './Sign.css'
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
const SignUp = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if(url) {
            uploadFields();
        }
    },[url]);

    const uploadPic = async () => {
        const data = new FormData()
        data.append("file", image);
        data.append("upload_preset","insta-mern"); // cloudinary upload preset 이름
        data.append("cloud_name", "kmc"); // cloudinary 내 닉네임
        await fetch("https://api.cloudinary.com/v1_1/kmc/image/upload", {
            method: "post",
            body: data,
        })
        .then(res => res.json())
        .then(data => {
            // url이 업데이트 되었을 때 usEffect를 통해 posting 해준다
            setUrl(data.url);
        })
        .catch(err => console.log(err))
    }

    const uploadFields = async () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({html: "invalid email", classes:"#c62828 red darken-3"})
        }
        await fetch('/signup', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        }).then(res => res.json())
        .then((data) => {
            if(data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else {
                M.toast({html: data.message, classes:"#43a047 green darken-1"});
                history.push('/signin');
            }
        })
        .catch(err => console.log(err));
    }

    const PostData = async () => {
        if(image) {
            uploadPic()
        }
        else {
            uploadFields();
        }
        
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    SignUp
                </button>
                <h5 className="signup-toggle">
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    );
};

export default SignUp;
