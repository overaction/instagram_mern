import React, { useContext } from 'react'
import {Link,useHistory} from 'react-router-dom'
import { userContext } from '../App';

const Navbar = () => {
    const history = useHistory();
    const {state, dispatch} = useContext(userContext);
    const renderList = () => {
        // 만약 state (svuser) 가 있다면 profile과 create만 보여지고 아니라면 그 반대이다
        if(state) {
            return [
                <li>
                    <Link to="/profile">Profile</Link>
                </li>,
                <li>
                    <Link to="/create">Create Post</Link>
                </li>,
                <li>
                    <Link to="/myfollowerspost">My Follwer's Posts</Link>
                </li>,
                <li>
                    <button
                        className="btn waves-effect waves-light #26c6da cyan lighten-1"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({type:"CLEAR"})
                            history.push('/signin');
                        }}
                    >
                        Logout
                    </button>
                </li>,
            ];
        }
        else {
            return [
                <li>
                    <Link to="/signin">Login</Link>
                </li>,
                <li>
                    <Link to="/signup">Signup</Link>
                </li>,
            ];
        }
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
        </nav>
    );
}

export default Navbar;
