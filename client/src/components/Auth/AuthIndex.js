import React from 'react';
import AuthForm from './AuthForm';
import  { withUser }  from '../../context/UserProvider';
import { Redirect } from 'react-router-dom';
import './authstyles.css';


class Auth extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      password: '',
      toggle: false
    }
  }

  toggler = () => {
    this.setState(prev => ({ toggle: !prev.toggle }))
  }

  handleChange = (e) => {
    const {name, value} = e.target;
    this.setState({ [name]: value });
  }

  handleSignUpSubmit = (e) => {
    e.preventDefault();
    const creds = {
      name: this.state.name,
      password: this.state.password
    }
    this.props.signup(creds);
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    const creds = {
      name: this.state.name,
      password: this.state.password
    }
    this.props.login(creds);
  }

  render() {
    if (this.props.token) {
      return <Redirect to='/' />
    }
    return (
      <div className='auth-container'>
        {
          !this.state.toggle ?
          <>
          <AuthForm name={this.state.name}
                  password={this.state.password}
                  handleChange={this.handleChange}
                  handleSubmit={this.handleSignUpSubmit}
                  btnText='Sign Up'          
                  />
            <p style={{marginTop: '10px', cursor: 'pointer'}} onClick={this.toggler}>Already have an account? Click here.</p>
          </>
                  :
          <>
            <AuthForm name={this.state.name}
            password={this.state.password}
            handleChange={this.handleChange}
            handleSubmit={this.handleLoginSubmit}
            btnText='Log In'          
                      />
            <p style={{marginTop: '10px', cursor: 'pointer'}} onClick={this.toggler}>Need to get an account? Click here.</p>
          </>
        }
        <div style={{marginTop: '20px'}}>
          <h3>{this.props.authErrMsg}</h3>
        </div>
      </div>
    )
  }
}


export default withUser(Auth);