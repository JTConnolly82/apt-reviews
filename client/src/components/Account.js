import React from 'react';
import axios from 'axios';
// import Review from './Review';
import AccountReview from './AccountReview';
import './account.css'

class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      userReviews: [],
      user: ''
    }
  }

  

  componentDidMount() {
    let theUser = this.props.user._id;
    axios.get(`/user/${theUser}`).then(res => {
      let {name} = res.data[0]
      this.setState({
        user: name
      })
    }).then(
  axios.get('/review/', {user: theUser}).then((res) => {
      let theReviews = res.data.filter(review => {
        return review.user === this.props.user._id
      })
      this.setState({
        userReviews: theReviews
      })
    }))
  }
  render() {
    let mappedAccountReviews = this.state.userReviews.map(review => {
      return <AccountReview key={Math.random()*1000}
                     title={review.title} 
                     description={review.description} 
                     wouldRecommend={review.wouldRecommend}
                     {...review}
                    />
    })

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div className='account-main'>
          <h1 style={{marginTop: '32px', fontSize: '22px'}}>{this.state.user}</h1>
        </div>
        <div className='account-reviews-wrap'>
          <h2>Your Reviews</h2>
          <div className='account-reviews'>
            {mappedAccountReviews}
          </div>
        </div>
      </div>
    )
  }
  
}


export default Account;

