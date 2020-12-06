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
  // 만약 localhost:3000/profile 처럼 홈페이지에 주소를 입력해도 useEffect에 의해 아래 logic이 먼저 실행되기 때문에 '/'로 이동한다
  // 그러나 이것은 refresh 될 때만 적용되고, Link에 의해 refreshing 되지 않도록 되어있기 때문에 완벽하진 않다
  // 그래서 Navbar.js의 Link에 조건을 달아주었다
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("svuser"));
    // user의 정보를 저장
    if(user) {
      dispatch({type:"USER", payload:user});
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
