import React from 'react';
import './reviewForm.css';

class reviewForm extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      apt: '',
      description: '',
      wouldRecommend: Boolean,
    }
  }

  handleChange = (e) => {
    const {name, value} = e.target;
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let submitObj = {
      title: this.state.title,
      description: this.state.description,
      wouldRecommend: this.state.wouldRecommend,
      // user: 
    }
   this.props.addReview(submitObj);
    this.setState({
      title: '',
      description: '',
      wouldRecommend: ''
    })
  }

  render() {

    return (
      <form className='review-form' onSubmit={this.handleSubmit}>
        <input 
          type='text'
          name='title'
          onChange={this.handleChange}
          placeholder='review title'
        />
        <input 
          type='text'
          name='description'
          onChange={this.handleChange}
          placeholder='review details'
        />

        Yes<input type='radio'
               name='wouldRecommend' 
               value={true} 
               onChange={this.handleChange} />
        No<input type='radio' 
                 name='wouldRecommend' 
                 value={false}
                 onChange={this.handleChange} />
        <button>Post</button>
      </form>
    )
  }


}


export default reviewForm;