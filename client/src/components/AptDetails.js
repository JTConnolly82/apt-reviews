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

    let aptImages = this.state.reviews.flatMap((review) => {
      return review.images
    })

    console.log('apt images', aptImages)

    
    let slides = []
    for (let i = 0; i < aptImages.length; i++) {
      slides.push(<Slide index={i} style={{borderLeft: '3px solid #fbf7ed', borderRight: '3px solid #fbf7ed', boxSizing: 'border-box'}}>
                    <img src={aptImages[i].toString()} style={{height: '259px', width: '345px'}} />
                  </Slide>)
    }

    console.log('slides', slides)

    let sliderStyles;
    let visibleSlides;

    // sliderStyles = {
    //   width: '1440px', height: '270px', marginTop: '30px'
    // }
    // if (slides.length >= 4) {
    //   visibleSlides = 4
    // }

    // responsiveness for slider
    // if (this.props.windowWidth > 1260) {
      
    // }
    // if (this.props.windowWidth <= 1260) {
    //   sliderStyles = {
    //     width: '1080px', height: '270px', marginTop: '30px'
    //   }
    //   visibleSlides = 3
    // }
    // if (this.props.windowWidth <= 1080) {
    //   sliderStyles = {
    //     width: '720px', height: '270px', marginTop: '30px'
    //   }
    //   visibleSlides = 2
    // }
    // if (this.props.windowWidth <= 720) {
    //   sliderStyles = {
    //     width: '360px', height: '270px', marginTop: '30px'
    //   }
    //   visibleSlides = 1
    // }

    if (slides.length === 1 || this.props.windowWidth <= 720) {
      sliderStyles = {
            width: '345px', height: '270px', marginTop: '30px'
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
          <div className='apt-details-main'>
            <div className='apt-details-head'>
            <h1 style={{textAlign: 'center'}}>{`${street_address} ${apt_number && apt_number}`}</h1>
            <span style={{display: 'flex', justifyContent: 'center'}}>
              <h3 style={{fontSize: '20px'}}>{`${city} , ${state}`}</h3>
            </span>
            <div id='apt-details-title-divider'></div>
            <div className='bed-bath-div'>
              <h2 id='bath'>{bathrooms} 🛁</h2>
              <h2 id='bed'>{bedrooms} 🛏</h2>
            </div>
            {this.state.reviews.length > 0 ? <h2 style={{minWidth: '330px', fontSize: '22px', textAlign: 'center'}}>{Math.round(percentageofRenters)}% of reviewers recommend</h2>: <h2></h2>}
            </div>
        </div>
        
          <CarouselProvider
          naturalSlideWidth={4}
          naturalSlideHeight={3}
          totalSlides={slides.length}
          visibleSlides={visibleSlides}
          touchEnabled={true}
          infinite={true}
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
          >
          <div style={{display: 'flex', marginBottom: '10px', alignItems: 'center'}}>
            <ButtonBack style={{backgroundColor: 'inherit', border: 'none'}}><img src={process.env.PUBLIC_URL + '/back.png'} style={{width: '20px', height: '20px', marginTop: '5px'}} /></ButtonBack>
                <Slider style={sliderStyles}>
                  {slides}
                </Slider>
              <ButtonNext style={{backgroundColor: 'inherit', border: 'none'}}><img src={process.env.PUBLIC_URL + '/next.png'} style={{width: '20px', height: '20px', marginTop: '5px'}} /></ButtonNext>
          </div>
        </CarouselProvider>

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