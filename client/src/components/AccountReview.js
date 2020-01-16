import React from 'react';
import {Link} from 'react-router-dom';
import './accountreview.css';
import axios from 'axios';

class AccountReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',

    }
  }

  componentDidMount() {
    axios.get('/apartment/' + this.props.apt).then((res) => {
      this.setState({
        address: res.data.address
      })
    })
  }

    render() {
    return (
      <Link to={'/apartment/' + this.props.apt}>
      <div className='apt-review-wrapper'>
          <div className='title-div'>
            <h2>{this.state.address}</h2>
            <h3>{this.props.title}</h3>
          </div>
          <div id='wrapper'>
            <div id='scroller'>
              <h4>{this.props.description}</h4>
            </div>
          </div>
          <div>

          </div>
      </div>
      </Link>
    )
    }



}

export default AccountReview;