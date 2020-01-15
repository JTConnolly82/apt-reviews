import React from 'react';
import {Link} from 'react-router-dom';
import './accountreview.css';

const AccountReview = (props) => {

    console.log(props)
    return (
      <Link to={'/apartment/' + props.apt}>
      <div className='apt-review-wrapper'>
          <div className='title-div'>
            {/* want this to be the apt address */}
            <h3>{props.title}</h3>
          </div>
          <div id='wrapper'>
            <div id='scroller'>
              <h4>{props.description}</h4>
            </div>
          </div>
          <div>

          </div>
      </div>
      </Link>
    )
  



}

export default AccountReview;