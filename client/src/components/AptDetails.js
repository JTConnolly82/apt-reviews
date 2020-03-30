import React from 'react';
import axios from 'axios';
import 'pure-react-carousel/dist/react-carousel.es.css';
import windowSize from 'react-window-size';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { withUser } from '../context/UserProvider';
import Review from './Review';
import './aptDetails.css';
import { Link } from 'react-router-dom';




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
      file: null,
      aptComplex: ''
    }
  }
  

  componentDidMount() {
    let {_id} = this.props.match.params
    axios.get(`/apartment/${_id}`).then(res => {
      console.log('1 apartment', res.data)
      this.setState({
        apt: res.data,
      })
      let complex = this.state.apt.complex
      return complex
    }).then( complex => {
      axios.get("/aptcomplex/" + complex).then(res => {
        console.log('3 apt complex', res.data)
        this.setState({
          aptComplex: res.data
        })
      })
    })
    .then(
      axios.get(`/review/${_id}`).then(res => {
        console.log('2 reviews', this.state)
        let aptReviews = res.data
        this.setState({
          reviews: aptReviews.reverse(),
          noReviewsMessage: 'Leave the first review for this location!'
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
      starRating: this.state.starRating,
      file: this.state.file
    };
    axios.post('/api/review', reviewObj, config)
      .then((res)=> {
        let updatedReviews = [res.data, ...this.state.reviews];
        this.setState({
          reviews: updatedReviews,
          aptFormTitle: '',
          aptFormDescription: '',
          aptFormRating: '',
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
  
    let {street_address, apt_number, city, state, bathrooms, bedrooms, complex_name, complex_website} = this.state.apt;
    let totalRatings = 0;
    let reviewComponents = this.state.reviews.map((review) => {
      totalRatings = totalRatings + review.starRating;
      return <Review handleEditSubmit={this.handleEditSubmit}
                     handleDelete={this.handleDelete}
                     handleChange={this.handleChange}
                     key={Math.random()*1000}
                     apt={review.apt}
                     title={review.title} 
                     description={review.description} 
                     starRating={review.starRating}
                     _id={review._id}
                     userId={this.props.user._id}
                     userName={review.userName}
                     images={review.images}
                     {...review}
                     />
    })

    let averageRating = (totalRatings / this.state.reviews.length);

    let aptImages = this.state.reviews.flatMap((review) => {
      return review.images
    })

    
    let slides = []
    for (let i = 0; i < aptImages.length; i++) {
      slides.push(
                  <Slide key={Math.random() * 6000} index={i} style={{ boxSizing: 'border-box'}}>
                    <img src={aptImages[i].toString()} style={{height: '294px', width: '380px', border: '3px solid white'}} />
                  </Slide>
                  )
    }

    let sliderStyles;
    let visibleSlides;

    if (slides.length === 1 || this.props.windowWidth <= 720) {
      sliderStyles = {
            width: '385px', height: '310px', marginTop: '30px'
          }
      visibleSlides = 1
    }
    if (slides.length === 2 && this.props.windowWidth > 720 || slides.length >= 2 && this.props.windowWidth > 720 ) {
      sliderStyles = {
            width: '690px', height: '270px', marginTop: '30px'
          }
      visibleSlides = 2
    }
    if (slides.length >= 3 && this.props.windowWidth > 1080) {
      sliderStyles = {
            width: '1035px', height: '270px', marginTop: '30px'
          }
      visibleSlides = 3
    }
    if (slides.length >= 4 && this.props.windowWidth > 1430) {
      sliderStyles = {
          width: '1380px', height: '270px', marginTop: '30px'
        }
      visibleSlides = 4
       
    }

    return (
      <div className='apt-details-wrapper'>
          <CarouselProvider
          naturalSlideWidth={4}
          naturalSlideHeight={3}
          totalSlides={slides.length}
          visibleSlides={visibleSlides}
          touchEnabled={true}
          infinite={true}
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
          >
          <div style={{display: 'flex', marginTop: '80px', marginBottom: '60px', height: '250px', alignItems: 'center'}}>
            <ButtonBack style={{backgroundColor: 'inherit', border: 'none'}}><img src={process.env.PUBLIC_URL + '/back.png'} style={{width: '20px', height: '20px', marginTop: '5px'}} /></ButtonBack>
                <Slider style={sliderStyles}>
                  {slides}
                </Slider>
              <ButtonNext style={{backgroundColor: 'inherit', border: 'none'}}><img src={process.env.PUBLIC_URL + '/next.png'} style={{width: '20px', height: '20px', marginTop: '5px'}} /></ButtonNext>
          </div>
        </CarouselProvider>
          <div className='details-and-apt-complex'>
            <div className='apt-details-head'>
            <h1 style={{fontWeight: 'bold'}}>{`${street_address}`}</h1>
            <h1 style={{fontWeight: 'bold'}}>{`${apt_number}`}</h1>
            <span style={{display: 'flex', justifyContent: 'center'}}>
              <h3 style={{fontSize: '20px'}}>{`${city} , ${state}`}</h3>
            </span>
            <div className='bed-bath-div'>
              <h2 id='bath'>{bathrooms} bath</h2>
              <h2 id='bed'>{bedrooms} bed</h2>
            </div>
            <h2 style={{color: '#808080', fontStyle: 'italic'}}>{this.state.reviews.length > 1 ? this.state.reviews.length + ' ' + 'reviews' : '1 review'}</h2>
              {this.state.reviews.length > 0 ? <span style={{display: 'flex', alignItems: 'center', height: '30px'}}><img id='star-img' src={process.env.PUBLIC_URL + '/star-icon.png'}/><h2 style={{minWidth: '330px', fontSize: '22px', color: '#42474c'}}>{(Math.round(averageRating * 10) / 10).toFixed(1)}</h2></span> : <h2>No reviews for this apartment</h2>}
            
            </div>
            <div className='complex-info'>
              <h3>{this.state.aptComplex.name}</h3>
              <h3>{this.state.aptComplex.website}</h3>
              <div style={{height: '1px', backgroundColor: 'lightgrey', width: '100%', marginTop: '10px', marginBottom: '10px'}}></div>
              <h5 style={{marginBottom: '8px', color: '#42474c', fontSize: '13px'}}>See more from {this.state.aptComplex.name}</h5>
              <Link to={`/aptcomplex/${this.state.aptComplex._id}`} className='more-complex-reviews'>Building Reviews</Link>
            </div>
        </div> 
            <div id='apt-details-title-divider'></div>
            { this.props.token ? 
          <Link to={`/review/${this.state.apt._id}`} id='leave-review-link'>Start Your Review</Link>
          :
          <Link to="/auth" id='leave-review-link'>Login To Start Review</Link>
        }
        <div className='details-review-wrapper'>
          {this.state.reviews.length > 0 ? <>
                        <div className='scroll-reviews'>
                          {/* <h2 style={{padding: '20px', color: '#808080'}}>{this.state.reviews.length > 1 ? this.state.reviews.length + ' ' + 'reviews' : '1 review'}</h2> */}
                          {reviewComponents}
                        </div>
                                           </> 
                        : 
                        <div>
                       <h2 className='no-review-text'>{this.state.noReviewsMessage}</h2>
                        {/* <img style={{maxWidth: '540px'}} src='https://image.freepik.com/free-vector/login-concept-illustration_114360-757.jpg' /> */}
                        </div>
                        }
        </div>
      </div>
    )
  }
}

export default withUser(windowSize(AptDetails));