import React from 'react';
import axios from 'axios';
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

  

  handleDeletePass = (e) => {
    e.preventDefault();
    this.props.handleDelete(this.props._id);
  };

  componentDidMount() {
    // console.log('mounted')
    // axios.get('/user/' + this.props.userId).then((res) => {
    //   let theUser = res.data[0].name
    //   this.setState({
    //     user: theUser
    //   })
    // })
  }

  render() {
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
            {/* <h4>Recommends  { this.props.wouldRecommend ? '👍' : '👎' }</h4> */}
            <span style={{display: 'flex', alignItems: 'center'}}><h3 style={{marginRight: '4px'}}>{ this.props.wouldRecommend ? '👍' : '👎' }</h3><h2>{this.props.title}</h2></span>
            <h3>{this.props.description}</h3>
          </div>
          <div className='review-buttons'>
            {this.props.user._id === this.props.userId && <>
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