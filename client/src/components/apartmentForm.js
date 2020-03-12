import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {withUser} from '../context/UserProvider';
import './apartmentForm.css';


class apartmentForm extends React.Component {
  constructor() {
    super();
    this.state = {
      street_address: '',
      apt_number: '',
      city: '',
      state: '',
      bedrooms: '',
      bathrooms: '',
      submitted: false,
      submittedObj: ''
    }
  }

  handleChange = (e) => {
    let {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let config = {
      headers: {'Authorization': "bearer " + this.props.token}
    }
    let submitObj = this.state;
    axios.post('/api/apartment', submitObj, config)
      .then((res)=> {
        this.setState({
          submitted: true,
          submittedObj: res.data
        })
      })
      .catch((err)=> {
        console.dir(err)
      })
  }

  // if (this.props.token) {
  //   return <Redirect to='/' />
  // }
  render() {
     if (this.state.submitted) {
    return <Redirect to={`/apartment/${this.state.submittedObj._id}`} />
  }
    return (
      // reviews apartments will post with reviews as empty array
      <div className='apt-form-wrapper'>
        <h1>Add an Apartment</h1>
        <form className='apt-form' onSubmit={this.handleSubmit}>
          <input className='apt-inputs' onChange={this.handleChange} name='street_address' placeholder='street address' />
          <input className='apt-inputs' onChange={this.handleChange} name='apt_number' placeholder='apartment number' />
          <input className='apt-inputs' onChange={this.handleChange} name='city' placeholder='city' />
          <input className='apt-inputs' onChange={this.handleChange} name='state' placeholder='state' />
          <input className='apt-inputs' onChange={this.handleChange} name='bedrooms' placeholder='bedrooms' />
          <input className='apt-inputs' onChange={this.handleChange} name='bathrooms' placeholder='bathrooms' />
          <button>Submit</button>
        </form>
      </div>
    )
  }
}

export default withUser(apartmentForm);