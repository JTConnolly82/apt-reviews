import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Nav.css';
import {withUser} from '../context/UserProvider';

const Nav = (props) => {

  const [width, setWidth] = useState(window.innerWidth);

    useEffect(()=> {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    })

   

    let menuDisplay;

    const [menuStyle, setMenu] = useState(false);

    const toggleMenu = () => {
      setMenu(!menuStyle)
    }

    menuStyle === true ? 
    menuDisplay = 
      <div className='dropdown-menu' onClick={toggleMenu}>
        <Link to={`/account/${props.user._id}`}>My Account</Link><h3 id='dropdown-logout' onClick={props.logout}>Logout</h3>
      </div> 
    :
    menuDisplay = <div></div>

  
    return (

      
      <div className='nav-container'>
        <Link to='/'><h1 className='nav-title'>Apt Reviews  </h1></Link>
        
        <div className='nav-options'>
          {/* <Link to='/apartment' className='nav-links'>Add Apt</Link> */}
          {
            !props.token ? <Link to="/auth" className='nav-links'>Login/Signup</Link>
          : 
          width < 545 ? 
          <>
          <div className='hamburger-div'>
            <img onClick={toggleMenu} id='burger-menu-icon' src={process.env.PUBLIC_URL + '/burgermenu.png'} />
          </div>
          {menuDisplay}
          </>
          :
            props.token && <><Link to={`/account/${props.user._id}`} className='nav-links'>My Account</Link><button className='log-btn' onClick={props.logout}>Logout</button></>
          }
        </div>
      </div>
      
    )


}


export default withUser(Nav);