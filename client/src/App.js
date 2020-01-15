import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from './components/Home';
import AuthIndex from './components/Auth/AuthIndex';
import Nav from './components/Nav';
import {withUser} from './context/UserProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './components/Account'
import apartmentForm from './components/apartmentForm';
import AptDetails from './components/AptDetails';
import './App.css';



class App extends React.Component {
  render() {

    const {token, logout, user, addReview} = this.props;

    return (
      <div className='app-wrapper'>
        <Nav token={token} logout={logout} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/auth" component={AuthIndex} />
          <ProtectedRoute 
            token={token}
            path='/account'
            component={Account}
            redirectTo="/"
            user={user}
          />
          <ProtectedRoute 
            token={token}
            exact path='/apartment'
            component={apartmentForm}
            redirectTo="/auth"
            user={user}
            addReview={addReview}
          />
          <Route path='/apartment/:_id' component={AptDetails} />
          <Route path='/account/:_id' component={Account} />
        </Switch>
      </div>
    )
  }
}


export default withUser(App);