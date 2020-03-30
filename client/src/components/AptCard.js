import React from 'react';
import {Link} from 'react-router-dom';
import './aptcard.css';

const AptCard = (props) => {

  console.log(props)

  return (
      <div className='apt-card-container'>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <h2 style={{marginRight: '10px', fontSize: '20px'}}>{props.street_address}</h2>
        <h2 style={{fontSize: '25px', color: ''}}>{props.apt_number}</h2>
        <span style={{display: 'flex'}}>
          <h3 style={{marginRight: '10px'}}>{`${props.bedrooms} bed`}</h3>
          <h3>{`${props.bathrooms} bath`}</h3>
        </span>
        </div>
        {/* <h3>{`${props.city}, ${props.state}`}</h3> */}
        <Link style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} to={`/apartment/${props._id}`}><button id='view-apt-button'>View</button></Link>
      </div>
  )

}

export default AptCard;