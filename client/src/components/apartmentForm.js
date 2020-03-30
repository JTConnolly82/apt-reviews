import React from 'react';
import axios from 'axios';
// import AptComplexSearch from './AptComplexSearch';
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
      submittedObj: '',
      isInComplex: false,
      complex_name: '',
      complex_website: ''
    }
  }

  handleIsComplex = (e) => {
    let {name, value} = e.target;
    this.setState(
     { isInComplex: value}
    )
    if (this.state.isComplex === false || "false") {
      this.setState({
        complex_name: '',
        complex_website: ''
      })
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
    let aptComplexObj = {name: this.state.complex_name, website: this.state.complex_website};

    axios.post('/api/aptComplex', aptComplexObj, config)
    .then((res) => {
      let submitAptObj = {
        street_address: this.state.street_address,
        apt_number: this.state.apt_number,
        city: this.state.city,
        state: this.state.state,
        bedrooms: this.state.bedrooms,
        bathrooms: this.state.bathrooms,
        complex: res.data._id
      }
      return submitAptObj;
    }).then((submitAptObj) => {
      axios.post('/api/apartment', submitAptObj, config)
      .then((res)=> {
        this.setState({
          submitted: true,
          submittedObj: res.data
        })
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
        <form className='apt-form' onSubmit={this.handleSubmit}>
        <h1 style={{fontSize: '22px', marginBottom: '10px', alignSelf: 'center'}}>Add an Apartment 🏘</h1>
        <h4 style={{margin: '0 auto', padding: '10px', textAlign: 'center'}}>Posting will allow you and others to leave reviews on this apartment.</h4>
          <input className='apt-inputs' onChange={this.handleChange} name='street_address' placeholder='street address' />
          <input className='apt-inputs' onChange={this.handleChange} name='apt_number' placeholder='apartment number' />
          <input className='apt-inputs' onChange={this.handleChange} name='city' placeholder='city' />
          <input className='apt-inputs' onChange={this.handleChange} name='state' placeholder='state' />
          <input className='apt-inputs' onChange={this.handleChange} name='bedrooms' placeholder='bedrooms' />
          <input className='apt-inputs' onChange={this.handleChange} name='bathrooms' placeholder='bathrooms' />
          <h3>Is this unit in an apartment complex?</h3>
          <div style={{ display: "flex", marginLeft: "10px" }}>
                <h4 style={{ marginRight: "5px" }}>Yes</h4>
                <input
                  onChange={this.handleIsComplex}
                  name="isInComplex"
                  type="radio"
                  value={true}
                  style={{ marginRight: "5px" }}
                />
                <h4 style={{ marginRight: "5px" }}>No</h4>
                <input
                  onChange={this.handleIsComplex}
                  name="isInComplex"
                  type="radio"
                  value={false}
                />
          </div>
             { this.state.isInComplex === false || this.state.isInComplex === 'false' ? 
             (<div></div>)
             :
             (<div style={{display: 'flex', flexDirection: 'column', width: '100%', marginTop: '15px'}}>
               {/* <AptComplexSearch /> */}
                <input onChange={this.handleChange} name='complex_name' className='apt-inputs' placeholder='name of apt complex' />
                <input onChange={this.handleChange} name='complex_website' className='apt-inputs' placeholder="apartment complex's website url" />
              </div>)
             }
              
          <button id='form-btn'>Add Apartment</button>
        </form>
      </div>
    )} 
}

export default withUser(apartmentForm);