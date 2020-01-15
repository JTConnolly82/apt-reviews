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

  // let {_id} = this.props.match.params
  //   axios.get(`/apartment/${_id}`).then(res => {
  //     console.log('found apt')
  //     console.log(res.data)
  //     this.setState({
  //       apt: res.data
  //     })
  //   })

  componentDidMount() {
    let theUser = this.props.user._id;
    axios.get(`/user/${theUser}`).then(res => {
      let {name} = res.data[0]
      console.log(name)
      this.setState({
        user: name
      })
    }).then(
  axios.get('/review/', {user: theUser}).then((res) => {
      let theReviews = res.data.filter(review => {
        return review.user === this.props.user._id
      })
      console.log(theReviews)
      this.setState({
        userReviews: theReviews
      })
    }))
  }
  render() {
    console.log(this.props);
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
          <h1 style={{marginTop: '32px'}}> {this.state.user}</h1>
        </div>
        <div className='account-reviews'>
          {mappedAccountReviews}
        </div>
      </div>
    )
  }
  
}


export default Account;

