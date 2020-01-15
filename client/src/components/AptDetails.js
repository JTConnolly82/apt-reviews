import React from 'react';
import axios from 'axios';
import {withUser} from '../context/UserProvider';
import Review from './Review';
import './aptDetails.css';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";




class AptDetails extends React.Component {
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
      // file: null
    }
  }


  componentDidMount() {
    let {_id} = this.props.match.params
    axios.get(`/apartment/${_id}`).then(res => {
      this.setState({
        apt: res.data,
        title: '',
        description: '',
        wouldRecommend: '',
        editing: false,
        reviews: [], 
        // file: null,
        _id: '',
        aptFormTitle: '',
        aptFormDescription: '',
        aptFormWouldRecommend: '',
      })
    }).then(
      axios.get(`/review/${this.props.match.params._id}`).then(res => {
        console.log('get to review/apt')
        console.log(res.data)
        let aptReviews = res.data
        this.setState({
          reviews: aptReviews.reverse()
        })
      })
    )
  }

  handleEditSubmit = (editDetails) => {
    let config = {
      headers: {'Authorization': "bearer " + this.props.token},
      'content-type': 'multipart/form-data'
    }
    axios.put('/api/review/', editDetails, config)
      .then((res)=> { 
        this.setState((prev) => {
         return {
           reviews: prev.reviews.map((review)=> {
             return review._id === editDetails.reviewId ? res.data : review
           })
          } 
        })
      })
      .catch((err)=> {
        console.dir(err)
      })
      console.log('handle edit finished in aptdetails')
  }

  handleDelete = (reviewId) => {
    let config = {
      headers: {'Authorization': "bearer " + this.props.token}
    }
    axios.delete('/api/review/' + reviewId, config)
    .then((res)=> {
      //find the review by looping through the state, and delete it
      let filteredReviews = this.state.reviews.filter((review) => {
        return review._id !== res.data._id
      })
      this.setState({
        reviews: filteredReviews
      })
    })
    .catch((err)=> {
      console.dir(err)
    })
  };

  

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
    };
    axios.post('/api/review', reviewObj, config)
      .then((res)=> {
        let updatedReviews = [res.data, ...this.state.reviews];
        this.setState({
          reviews: updatedReviews,
          aptFormTitle: '',
          aptFormDescription: '',
          aptFormWouldRecommend: '',
          // file: null
        })
        console.log(res);
      })
      .catch((err)=> {
        console.dir(err)
      })

  }

  // handleChange = (e) => {
  //   const {name, value} = e.target;
  //   this.setState({ [name]: value })
    
  // }

  handleFormChange = (e) => {
    const {name, value} = e.target;
    this.setState({ [name]: value })
  }

  // fileChangedHandler = (event) => {
  //   const file = event.target.files[0];
  //   this.setState({ file: file })
  //   console.log(file);
  // }

  render() {

    const settings = {
      dots: true,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    
    let {address, bathrooms, bedrooms} = this.state.apt;
    let recommendations = 0;
    let reviewComponents = this.state.reviews.map((review) => {
      review.wouldRecommend && recommendations++;
      return <Review handleEditSubmit={this.handleEditSubmit}
                     handleDelete={this.handleDelete}
                     handleChange={this.handleChange}
                     key={Math.random()*1000}
                     apt={review.apt}
                     title={review.title} 
                     description={review.description} 
                     wouldRecommend={review.wouldRecommend}
                     _id={review._id}
                     userId={review.user}
                     userName={review.userName}
                     />
    })

    let percentageofRenters = (recommendations / this.state.reviews.length)*100;
    return (
      <div className='apt-details-wrapper'>
          <div className='apt-details-main'>
            <h1>{address}</h1>
            <div className='bed-bath-div'>
              <h2 id='bath'>{bathrooms} 🛁</h2>
              <h2>{bedrooms} 🛏</h2>
            </div>
            {this.state.reviews.length > 0 ? <h2>{Math.round(percentageofRenters)}% of reviewers recommend this apartment</h2>: <div></div>}
            <div className='slider-div'>
              <Slider className='slider' {...settings}>
                <div>
                  <h3>1</h3>
                </div>
                <div>
                  <h3>2</h3>
                </div>
                <div>
                  <h3>3</h3>
                </div>
                <div>
                  <h3>4</h3>
                </div>
              </Slider>
            </div>
          {this.props.token ? <>
          <form className='apt-details-form' onSubmit={this.handleSubmit}>
            <input onChange={this.handleFormChange} id='title-input' name='aptFormTitle' value={this.state.aptFormTitle} placeholder='review title'/>
            <textarea onChange={this.handleFormChange} id='description-input' name='aptFormDescription' value={this.state.aptFormDescription} placeholder='review description' />
            {/* <input type='file' onChange={this.fileChangedHandler} /> */}
            <h4>Recommend this apartment?</h4>
            <div style={{display: 'flex'}}>
              <h4 style={{marginRight: '5px'}}>Yes</h4><input onChange={this.handleFormChange} name='aptFormWouldRecommend' type='radio' value='true' style={{marginRight: '5px'}}/>
              <h4 style={{marginRight: '5px'}}>No</h4><input onChange={this.handleFormChange} name='aptFormWouldRecommend' type='radio' value='false' />
            </div>
            <button id='apt-details-btn'>Post Review</button>
          </form>
        </>
        :
        <Link to='/auth'><h3 id='no-form'>Login to leave a review!</h3></Link>
        }</div>
        
        <div className='details-review-wrapper'>
          {this.state.reviews.length > 0 ? <>
                        <div className='scroll-reviews'>
                          {reviewComponents}
                        </div>
                                           </> 
                        : 
                        <h2 style={{marginRight: '200px', marginTop: '150px'}}>Be the first to leave a review! </h2>
                        }
        </div>
      </div>
    )
  }
}

export default withUser(AptDetails);