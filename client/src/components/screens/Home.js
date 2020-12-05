import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import './Home.css';
const Home = () => {
    const history = useHistory();
    const [posts,setPosts] = useState([]);
    useEffect(() => {
        fetch('/allposts', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
        }).then(res => res.json())
        .then(result => {
            if(result.error) {
                history.push('/signin')
            }
            else {
                setPosts(result.posts);
                console.log(result.posts)
            }
        })
    },[])
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
                        <h6>{item.title}</h6>
                        <p>{item.body}</p>
                        <input type="text" placeholder="add a comment" />
                    </div>
                </div>
                )
            })}
        </div>
    );
}

export default Home
