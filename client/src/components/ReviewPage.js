import React from 'react';
import axios from 'axios';
import {withUser} from '../context/UserProvider';
import {Redirect} from 'react-router-dom';


class ReviewPage extends React.Component {
  constructor() {
    super();
    this.state = {
      apt: {},
      title: '',
      description: '',
      wouldRecommend: '',
      editing: false,
      reviews: [], 
      _id: '',
      aptFormTitle: '',
      aptFormDescription: '',
      aptFormWouldRecommend: '',
      file: null
    }
  }

  componentDidMount() {
    let {_id} = this.props.match.params
    axios.get(`/apartment/${_id}`).then(res => {
      this.setState({
        apt: res.data,
      })
    })
  }

  handleFormChange = (e) => {
    const {name, value} = e.target;
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData();
    //     formData.append('myImage',this.state.file);
        
    let config = {
      headers: {'Authorization': "bearer " + this.props.token}
    }
    // const fd = new FormData();
    // fd.append('image', this.state.file, this.state.file.name);
    let reviewObj = {
      title: this.state.aptFormTitle,
      apt: this.state.apt._id,
      description: this.state.aptFormDescription,
      wouldRecommend: this.state.aptFormWouldRecommend,
      file: this.state.file
    };
    axios.post('/api/review', reviewObj, config)
      .then((res)=> {
        let updatedReviews = [res.data, ...this.state.reviews];
        this.setState({
          reviews: updatedReviews,
          aptFormTitle: '',
          aptFormDescription: '',
          aptFormWouldRecommend: '',
          file: null
        })
        this.props.history.push("/apartment/" + this.state.apt._id)
      })
      .catch((err)=> {
        console.dir(err)
      })
  }

  render() {

    let aptNum = this.state.apt.apt_number;
    let stAddress = this.state.apt.street_address;

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px'}}>
          <h2>{`Leave your review ${stAddress ? "for " + stAddress : ''} ${aptNum ? aptNum : ''} below 🏘`}</h2>
          <form className='apt-details-form' onSubmit={this.handleSubmit}>
            <div className='form-inner-div'>
            <input onChange={this.handleFormChange} id='title-input' name='aptFormTitle' value={this.state.aptFormTitle} placeholder='review title'/>
            <textarea onChange={this.handleFormChange} id='description-input' name='aptFormDescription' value={this.state.aptFormDescription} placeholder='review description' />
            {/* <input type='file' onChange={this.fileChangedHandler} /> */}
            <div className='recommend-form'>
              <h4>Recommend this apartment?</h4>
              <div style={{display: 'flex', marginLeft: '10px'}}>
                <h4 style={{marginRight: '5px'}}>Yes</h4><input onChange={this.handleFormChange} name='aptFormWouldRecommend' type='radio' value='true' style={{marginRight: '5px'}}/>
                <h4 style={{marginRight: '5px'}}>No</h4><input onChange={this.handleFormChange} name='aptFormWouldRecommend' type='radio' value='false' />
              </div>
            </div>
            <button id='apt-details-btn'>Post Review</button>
            </div>
          </form>
        </div>
    )
  }
}

export default withUser(ReviewPage);
 