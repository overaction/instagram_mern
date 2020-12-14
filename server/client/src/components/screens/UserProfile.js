import React, { useContext, useEffect, useState } from "react";
import { userContext } from '../../App';
import './Profile.css'
import {useParams} from 'react-router-dom';
import Loading from '../../Loading';
const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    const {state,dispatch} = useContext(userContext);
    const {userId} = useParams();
    const [showFollow, setShowFollow] = useState(state ? !state.followings.includes(userId) : true);
    useEffect(() => {
        fetch(`/user/${userId}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
        }).then(res => res.json())
        .then(result => {
            setProfile(result);
        })
    },[])

    const followUser = () => {
        fetch("/follow", {
            method: 'put',
            headers: {
                "Content-type": 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userId           
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result.myinfo);
            // 상태 업데이트
            dispatch({type:"UPDATE",payload: {
                followings: result.myinfo.followings,
                followers: result.myinfo.followers,
            }})
            // 로컬 업데이트
            localStorage.setItem("svuser",JSON.stringify(result.myinfo));
            // profile 업데이트
            setProfile((prev) => {
                return {
                    ...prev,
                    user: {
                        ...prev.user,
                        followers: [...prev.user.followers, result.otheruser._id]
                    }
                }
            })
        })
        setShowFollow(false);
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                "Content-type": 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userId,
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            dispatch({type:"UPDATE",payload: {
                followings: result.result2.followings,
                followers: result.result2.followers,
            }})
            localStorage.setItem('svuser',JSON.stringify(result.result2));
            setProfile(prev => {
                const newfollowers = result.result2.followers.filter(item => item._id !== userId)
                return {
                    ...prev,
                    user: {
                        ...prev.user,
                        followers: newfollowers
                    }
                }
            })
        })
        setShowFollow(true);
    }

    return (
        <>
            {!userProfile ? 
            <Loading /> 
            : 
                <div className="profileContainer">
                    <div className="profile-mine">
                        <img className="myimage"
                            src={userProfile.user.pic}
                        />
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            {showFollow
                            ?
                            <button
                                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                onClick={() => followUser()}
                            >
                                Follow
                            </button>
                            :
                            <button
                                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                onClick={() => unfollowUser()}
                            >
                                unFollow
                            </button>
                            }
                            <h5>{userProfile.user.email}</h5>
                            <div style={{display:"flex", justifyContent:"space-between", width: "108%"}}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.followings.length} followings</h6>
                            </div>
                        </div>
                    </div>
                    <div className="gallery">
                        {userProfile.posts.map((item) => {
                            return (
                                <img className="gallery-item" key={item._id} src={item.photo} alt={item.title} />
                            )
                        })}
                    </div>
                </div>
            }
        </>
    );
};

export default Profile;
