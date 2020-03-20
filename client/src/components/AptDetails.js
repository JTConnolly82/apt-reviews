import React from 'react';
import axios from 'axios';
import { withUser } from '../context/UserProvider';
import Review from './Review';
import './aptDetails.css';
import { Link } from 'react-router-dom';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";




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
      file: null
    }
  }


  componentDidMount() {
    let {_id} = this.props.match.params
    axios.get(`/apartment/${_id}`).then(res => {
      this.setState({
        apt: res.data,
      })
    }).then(
      axios.get(`/review/${this.props.match.params._id}`).then(res => {
        
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
      })
      .catch((err)=> {
        console.dir(err)
      })

  }

  handleFormChange = (e) => {
    const {name, value} = e.target;
    this.setState({ [name]: value })
  }

  fileChangedHandler = (event) => {
    const file = event.target.files[0];
    this.setState({ file: file })
    
  }

  render() {

    // const settings = {
    //   dots: true,
    //   infinite: true,
    //   speed: 400,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    // };
    
    let {street_address, apt_number, city, state, bathrooms, bedrooms} = this.state.apt;
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
                     userId={this.props.user._id}
                     userName={review.userName}
                     images={review.images}
                     {...review}
                     />
    })

    let percentageofRenters = (recommendations / this.state.reviews.length)*100;
    return (
      <div className='apt-details-wrapper'>
          <div className='apt-details-main'>
            <div className='apt-details-head'>
            <h1>{`${street_address} ${apt_number && apt_number}`}</h1>
            <span style={{display: 'flex'}}>
              <h3>{`${city} , ${state}`}</h3>
            </span>
            <hr style={{marginTop: '5px', marginBottom: '5px', maxWidth: '550px'}}/>
            <div className='bed-bath-div'>
              <h2 id='bath'>{bathrooms} 🛁</h2>
              <h2 id='bed'>{bedrooms} 🛏</h2>
            </div>
            {this.state.reviews.length > 0 ? <h2 style={{minWidth: '330px'}}>{Math.round(percentageofRenters)}% of reviewers recommend this apartment</h2>: <h2></h2>}
            </div>
          
        
        </div>

        { this.props.token ? 
          <Link to={`/review/${this.state.apt._id}`} id='leave-review-link'>Start Your Review</Link>
          :
          <Link to="/auth" id='leave-review-link'>Login To Start Review</Link>
        }
        
        <div className='details-review-wrapper'>
          {this.state.reviews.length > 0 ? <>
                        <div className='scroll-reviews'>
                          {reviewComponents}
                        </div>
                                           </> 
                        : 
                        <div>
                        <h2 className='no-review-text'>Leave the first review for this location!</h2>
                        {/* <img style={{maxWidth: '540px'}} src='https://image.freepik.com/free-vector/login-concept-illustration_114360-757.jpg' /> */}
                        </div>
                        }
        </div>
      </div>
    )
  }
}

export default withUser(AptDetails);