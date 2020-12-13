import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext } from '../../App';
import './Profile.css'
const Profile = () => {
    const [myposts, setMyposts] = useState([]);
    const {state,dispatch} = useContext(userContext);
    const [image, setImage] = useState('');
    const fileInput = useRef();
    useEffect(() => {
        fetch('/mypost', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
        }).then(res => res.json())
        .then(result => {
            setMyposts(result.mypost);
            console.log(result);
        })
    },[])

    useEffect(() => {
        if(image) {
            const data = new FormData()
            data.append("file", image);
            data.append("upload_preset","insta-mern"); // cloudinary upload preset 이름
            data.append("cloud_name", "kmc"); // cloudinary 내 닉네임
            fetch("https://api.cloudinary.com/v1_1/kmc/image/upload", {
                method: "post",
                body: data,
            })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('svuser',JSON.stringify({...state, pic :data.url}));
                dispatch({type:"UPDATE_PROFILE",payload: {
                    pic: data.url
                }})
                fetch('/updatepic', {
                    method: 'put',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('jwt'),
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                })
                .then(res => res.json())
                .then(result => console.log(result))
            })
            .catch(err => console.log(err))
        }
    },[image]);

    const uploadProfileImg = (file) => {
        setImage(file);
    }

    return (
    
        <div className="profileContainer">
            <div className="profile-mine">
                <input type="file" style={{display: "none"}} onChange={(e) => uploadProfileImg(e.target.files[0])} ref={fileInput}/>
                <img className="myimage" onClick={() => {
                    fileInput.current.click()
                }}
                    src={state ? state.pic : 'loading'}
                />
                <div>
                    <h4>{state ? state.name : "Loading"}</h4>
                    <h5>{state ? state.email : "Loading"}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width: "108%"}}>
                        <h6>{myposts.length} posts</h6>
                        <h6>{state ? state.followers.length : 0} followers</h6>
                        <h6>{state ? state.followings.length: 0} followings</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {myposts.map((item) => {
                    return (
                        <img className="gallery-item" key={item._id} src={item.photo} alt={item.title} />
                    )
                })}
            </div>
        </div>
    );
};

export default Profile;
