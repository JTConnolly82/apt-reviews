import React from 'react';
import './review.css'
import {withUser} from '../context/UserProvider'


class Review extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      description: props.description,
      wouldRecommend: props.wouldRecommend,
      editing: false,
      user: ''
    }
  }

  

  handleEditToggle = () => {
    this.setState({
      editing: true
    })
  }

  handleChange = (e) => {
    const {name, value} = e.target;
    this.setState({ [name]: value })
  }

  passEditSubmit = (e) => {
    e.preventDefault();
    let editObj = {
      title: this.state.title,
      description: this.state.description,
      wouldRecommend: this.state.wouldRecommend,
      reviewId: this.props._id,
      apt: this.props.apt
    }
    this.props.handleEditSubmit(editObj);
  }

  // setImageContainer = () => {
  //   document.getElementsByClassName('review-image-container')
  //     .style = {
  //       overflowX: 'scroll'
  //     }
  // }

  

  handleDeletePass = (e) => {
    e.preventDefault();
    this.props.handleDelete(this.props._id);
  };


  render() {
    

    let dateCreated = new Date(this.props.createdAt).toDateString();
    let dateUpdated = new Date(this.props.updatedAt).toDateString();
    let displayedDate;
    
    if (this.props.createdAt !== this.props.updatedAt) {
      displayedDate = `Updated ${dateUpdated}`
    } else {
      displayedDate = `Created ${dateCreated}`
    }

    let mappedImageUrls = this.props.images.map((url) => {
      return <img className='review-images' src={url.toString()} alt='pic' />
    })

    return (
     <> { this.state.editing ? 
      
      <div className='review-container'>
        <form className='edit-form'>
          <div style={{display: 'flex', height: '100px', flexDirection: 'column', justifyContent: 'space-around'}}>
            <input className="edit-input" value={this.state.title} onChange={this.handleChange} name='title' placeholder={this.props.title}/>
            <textarea className="edit-input" id='edit-desc' value={this.state.description} onChange={this.handleChange} name='description' placeholder={this.props.description}/>
          </div>
          false<input onChange={this.handleChange} name='wouldRecommend' value='false' type='radio' />
          true<input onChange={this.handleChange} name='wouldRecommend' value='true' type='radio' />
          <button id='edit-submit' onClick={this.passEditSubmit}>Submit</button>
          <button id='edit-cancel' onClick={()=>{this.setState({editing: false})}}>Cancel</button>
        </form>
      </div>
      // ternary semi
      : <div className='review-container'>
          <div className='review-info'>
            <h3>👤 {this.props.userName}</h3>
            <h5 style={{color: 'grey'}}>{displayedDate}</h5>
            <span style={{display: 'flex', alignItems: 'center', marginBottom: '25px', marginTop: '10px'}}>
              <h4 style={{marginRight: '4px', color: '#42474c'}}>Recommends?{ this.props.wouldRecommend ? '👍' : '👎' }</h4>
            </span>
            <h2>{this.props.title}</h2>
            <h3 style={{marginBottom: '10px'}}>{this.props.description}</h3>
            <div className='images-and-button-container'>
              <div className='review-images-container'>
                {mappedImageUrls.length > 0 ? mappedImageUrls : <h3>No images for this review</h3>}
              </div>
              {/* <button className='image-reveal-button' id='img-button' onClick={this.setImageContainer}>See All Pictures</button> */}
            </div>
          </div>
          <div className='review-buttons'>
            {this.props.userId === this.props.user && <>
            <button id='delete' onClick={this.handleDeletePass}>Delete</button>
            <button id='edit' onClick={this.handleEditToggle}>Edit</button>
              </>
          }
          </div>
        </div> 
      }</>
    )
  }


}


export default withUser(Review);