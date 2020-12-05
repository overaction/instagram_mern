import React, { createContext, useContext, useEffect, useReducer } from 'react'
import Navbar from './components/Navbar';
import './App.css';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import SignIn from './components/screens/SignIn';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';

import {reducer, initialState} from './reducers/userReducer';

export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state,dispatch} = useContext(userContext);
  // 만약 로그인 정보가 남아있다면 홈페이지로 이동 / 아니라면 로그인 페이지로 이동
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("svuser"));
    if(user) {
      dispatch({type:"USER", payload:user});
      history.push('/');
    }
    else {
      history.push('/signin');
    }
  },[history]);
  return (
      <Switch>
          <Route exact path="/">
              <Home />
          </Route>
          <Route path="/signin">
              <SignIn />
          </Route>
          <Route path="/signup">
              <Signup />
          </Route>
          <Route path="/profile">
              <Profile />
          </Route>
          <Route path="/create">
              <CreatePost />
          </Route>
      </Switch>
  );
}  

function App() {
  const [state, dispatch] = useReducer(reducer,initialState);
  return (
      <userContext.Provider value={{ state, dispatch }}>
          <BrowserRouter>
              <Navbar />
              <Routing />
          </BrowserRouter>
      </userContext.Provider>
  );
}

export default App;
