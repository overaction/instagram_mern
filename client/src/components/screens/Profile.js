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
                    src="data:image/png;base64,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"
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
