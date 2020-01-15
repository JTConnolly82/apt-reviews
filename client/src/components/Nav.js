import React from 'react';
import {Link} from 'react-router-dom';
import './Nav.css';
import {withUser} from '../context/UserProvider';

class Nav extends React.Component {

  render() {
    return (
      <div className='nav-container'>
        <Link to='/'><h1 className='nav-title'>Apt Reviews</h1></Link>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Link to='/apartment' className='nav-links'>Add Apt</Link>
          {!this.props.token && <Link to="/auth" className='nav-links'>Login/Signup</Link>}
          { this.props.token && <><Link to={`/account/${this.props.user._id}`} className='nav-links'>Account</Link><button className='log-btn' onClick={this.props.logout}>Logout</button></>}
        </div>
      </div>
    )
  }


}


export default withUser(Nav);