import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { userContext } from '../../App';
import './Home.css';
const Home = () => {
    const history = useHistory();
    const [posts,setPosts] = useState([]);
    const {state,dispatch} = useContext(userContext);

    useEffect(() => {
        fetch('/allposts', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
        }).then(res => res.json())
        .then(result => {
            console.log(result);
            if(result.error) {
                history.push('/signin')
            }
            else {
                setPosts(result.posts);
            }
        })
    },[]);

    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {
            console.log(posts)
            const newData = posts.map(item => {
                // 만약 기존 posts의 id === 좋아요 누른 post의 id 이라면
                // 좋아요 누른 post로 교체
                if(item._id === result._id) {
                    return result;
                }
                // 아니라면 기존값 그대로 리턴
                else {
                    return item;
                }
            })
            setPosts(newData);
        }).catch(err => console.log(err));
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = posts.map(item => {
                if(item._id === result._id) {
                    return result;
                }
                else {
                    return item;
                }
            })
            setPosts(newData);
        }).catch(err => console.log(err));
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text: text,
                postId: postId,                
            })
        }).then(res => res.json())
        .then(result => {
            const newData = posts.map((item) => {
                if(item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setPosts(newData);
        }).catch(err => console.log(err));
    }

    return (
        <div className="home">
            {posts.map((item) => {
                console.log(item)
                return (
                    <div className="card home-card" key={item._id}>
                    <h5>{item.postedBy.name}</h5>
                    <div className="card-image">
                        <img src={item.photo} />
                    </div>
                    <div className="card-content">
                        <i className="material-icons">favorite</i>
                        {item.likes.includes(state._id)
                        ? <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
                        :  <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                        }
                        <h6>{item.likes.length} likes</h6>
                        <h6>{item.title}</h6>
                        <p>{item.body}</p>
                        {
                            item.comments.map(item => {
                                return (
                                    <h6 key={item._id}><span className="card-commentby">{item.commentBy.name}</span>{item.text}</h6>
                                )
                            })
                        }
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            makeComment(e.target.comment.value, item._id)
                            e.target.comment.value = '';
                        }}>
                            <input name="comment" type="text" placeholder="add a comment" />
                        </form>
                    </div>
                </div>
                )
            })}
        </div>
    );
}

export default Home
