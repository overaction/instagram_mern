import React, { useContext, useEffect, useState } from "react";
import { userContext } from '../../App';
import './Profile.css'
const Profile = () => {
    const [myposts, setMyposts] = useState([]);
    const {state,dispatch} = useContext(userContext);
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
    return (
        <div className="profileContainer">
            <div className="profile-mine">
                <img className="myimage"
                    src={state ? state.pic : ''}
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
