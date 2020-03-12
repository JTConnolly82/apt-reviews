import React from 'react';
import './Home.css';
import AptSearchbar from './AptSearchbar';



class Home extends React.Component {
  render() {
    return (
      <div>
        <div className='home-hero'>
            {/* <h1>Rental Unit Reviews</h1> */}
            <h2>Apartment Reviews</h2>
            <h3>Search reviews from our community of renters to help find a better apartment.</h3>
              <AptSearchbar />
        </div>
        <div className='home-content'>
          <div className='home-statement'>
            <h2>
              Read our tenant reviews to learn about apartments.
            </h2>
          </div>
          <div id='apt-wrap'>
              <div className='text-wrap'>
                <h3>
                  Moving into a new apartment?
                  Read recent tenant reviews to find out more about the apartment 
                  you're considering before you move in.
                </h3>
              </div>
              <div id='interior-icon-div'>
                <img id='interior-icon' src={process.env.PUBLIC_URL + '/interior.png'} />
              </div>
            </div>
            <div id='phone-wrap'>
              <div id='phone-icon-div'>
                <img id='phone-icon' src={process.env.PUBLIC_URL + '/phonepic.png'} />
              </div>
              <div className='text-wrap'>
                <h3>
                What are the neighbors like? What room gets the most light? 
                  Is the noise from the street too loud? 
                  Search through our apartment listings to find reviews. 
                </h3>
              </div>
            </div>
            <div id='apt-wrap'>
              <div className='text-wrap'>
                <h3>
                  Write your own reviews to share important details about apartments 
                  you've lived in to help future tenants make the right choice!
                </h3>
              </div>
              <div id='apt-icon-div'>
                <img id='apt-icon' src={process.env.PUBLIC_URL + '/apartmenthome.png'} />
              </div>
            </div>
          </div>
      </div>
    )
  }
}


export default Home;