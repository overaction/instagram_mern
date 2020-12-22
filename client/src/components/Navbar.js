import React, { useContext, useEffect, useRef, useState } from 'react'
import {Link,useHistory} from 'react-router-dom'
import { userContext } from '../App';
import M from 'materialize-css'
import Axios from 'axios';

const Navbar = () => {
    const searchModal = useRef(null);
    const [search, setSearch] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const history = useHistory();
    const {state, dispatch} = useContext(userContext);

    useEffect(() => {
        M.Modal.init(searchModal.current)
    },[])

    const googleLogout = () => {
        Axios.get('/api/logout')
        .then(data => console.log(data));
    }

    const renderList = () => {
        // 만약 state (svuser) 가 있다면 profile과 create만 보여지고 아니라면 그 반대이다
        if(state) {
            return [
                <li key="1"><i className="material-icons modal-trigger" href="#modal1" style={{color:'black'}}>search</i></li>,
                <li key="2">
                    <Link to="/profile">Profile</Link>
                </li>,
                <li key="3">
                    <Link to="/create">Create Post</Link>
                </li>,
                <li key="4">
                    <Link to="/myfollowerspost">My Follwer's Posts</Link>
                </li>,
                <li key="5">
                    <button
                        className="btn waves-effect waves-light #26c6da cyan lighten-1"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({type:"CLEAR"});
                            history.push('/signin');
                            googleLogout();
                        }}
                    >
                        Logout
                    </button>
                </li>,
            ];
        }
        else {
            return [
                <li key="6">
                    <Link to="/signin">Login</Link>
                </li>,
                <li key="7">
                    <Link to="/signup">Signup</Link>
                </li>,
            ];
        }
    }

    const searchUsers = (query) => {
        setSearch(query);
        fetch('/search-users', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                query,
            })
        })
        .then(res => res.json())
        .then(result => {
            setUserDetails(result.user);
            console.log(result)
        });
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">
                    Instagram
                </Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{color:'black',width:'30%'}}>
                <div className="modal-content">
                    <input type="text" placeholder="search" value={search} onChange={(e) => searchUsers(e.target.value)}/>
                    <ul className="collection">
                        {userDetails ? userDetails.map((item) => {
                            return (
                                <Link
                                    key={item._id}
                                    to={
                                        item._id === state._id
                                            ? `/profile`
                                            : `/profile/${item._id}`
                                    }
                                    onClick={() => {
                                        M.Modal.getInstance(
                                            searchModal.current
                                        ).close();
                                    }}
                                >
                                    <li className="collection-item avatar">
                                        <img src={item.pic} alt="" className="circle" />
                                        <span className="title">{item.name}</span>
                                        <p>{item.email} <br/>
                                            {item.followers.length} followers
                                        </p>
                                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                                    </li>
                                </Link>
                            );
                        }) : ''}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
