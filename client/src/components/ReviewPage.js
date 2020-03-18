import React from 'react';
import axios from 'axios';
import { withUser } from '../context/UserProvider';
import './reviewpage.css';



class ReviewPage extends React.Component {
  constructor() {
    super();
    this.state = {
      apt: {},
      wouldRecommend: '',
      reviews: [], 
      _id: '',
      aptFormTitle: '',
      aptFormDescription: '',
      aptFormWouldRecommend: '',
      files: [],
      thumbnailFiles: []
    }
  }

  componentDidMount() {
    let {_id} = this.props.match.params
    axios.get(`/apartment/${_id}`).then(res => {
      this.setState({
        apt: res.data,
      })
    })
  }

  

  
  // uploadMultipleFiles = (e) => {
  //   this.fileObj.push(e.target.files)
  //   console.log('file object', this.fileObj);
  //       for (let i = 0; i < this.fileObj[0].length; i++) {
  //           this.fileArray.push(
  //             this.fileObj[0][i],
  //             // url: URL.createObjectURL(this.fileObj[0][i]),
  //             // description: '',
  //             // reviewId: this.props.match.params
  //           )
  //       }
  //       console.log(this.fileArray[0])
  //       this.setState({ thumbnailFiles: this.fileArray })
  // }



  // handlePicDescriptionChange = (e) => {
  //   let { value } = e.target;
  //   let copiedState = this.state;
  //   for (let i = 0; i < this.state.files.length; i++) {
  //     if (copiedState.files[i].url === e.target.previousSibling.src) {
  //         copiedState.files[i].description = value;
  //     }
  //   }
  //   this.setState({
  //     ...copiedState
  //   })
  // }

  handleFiles = (e) => {

  
    let thumbnailStagingArray = [];
        for (let i = 0; i < e.target.files.length; i++) {
            thumbnailStagingArray.push(
              {url: URL.createObjectURL(e.target.files[i])}
              // description: '',
              // reviewId: this.props.match.params
            )
        }
        
        this.setState({ thumbnailFiles: thumbnailStagingArray })


    let fileArr = [];
    fileArr.push(e.target.files)
    this.setState({
      files: [...fileArr]
    })
  }

  handleFormChange = (e) => {
    const {name, value} = e.target;
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData();
    //     formData.append('myImage',this.state.file);
    
    //config for text going to mongo
    let config = {
      headers: {
        'Authorization': "bearer " + this.props.token, 
      }
    }
    // config for files going to s3
    let filesConfig = {
      headers: {
        'Authorization': "bearer " + this.props.token, 
        'Content-Type': 'multipart/form-data'
      }
    }

    
    let formData = new FormData();
    for (let i = 0; i < this.state.files[0].length; i++) {
      console.log('files in state', this.state.files[0][i])
      formData.append(`file--${i}`, this.state.files[0][i])
    }
    

    let reviewObj = {
      title: this.state.aptFormTitle,
      apt: this.state.apt._id,
      description: this.state.aptFormDescription,
      wouldRecommend: this.state.aptFormWouldRecommend
    };

      axios.post('/api/review', reviewObj, config)
      .then((res)=> {
        console.log(res)
      })
      .catch((err)=> console.dir(err))

      axios.post('/api/reviewImages', formData, filesConfig)
        .then(res => {
          console.log(res)
          this.setState({
            aptFormTitle: '',
            aptFormDescription: '',
            aptFormWouldRecommend: '',
            files: null
          })
          this.props.history.push("/apartment/" + this.state.apt._id)
        })
        .catch(err => console.dir(err))
        
  }

  render() {

    let aptNum = this.state.apt.apt_number;
    let stAddress = this.state.apt.street_address;

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px'}}>
          <h2>{`Leave your review ${stAddress ? "for " + stAddress : ''} ${aptNum ? aptNum : ''} below 🏘`}</h2>
    
          <form className='apt-details-form' onSubmit={this.handleSubmit}>
            <div className='form-inner-div'>
            <input onChange={this.handleFormChange} id='title-input' name='aptFormTitle' value={this.state.aptFormTitle} placeholder='review title'/>
            <textarea onChange={this.handleFormChange} id='description-input' name='aptFormDescription' value={this.state.aptFormDescription} placeholder='review description' />
            <input name='files' type='file' onChange={this.handleFiles} style={{paddingBottom: '20px'}} multiple/>
            <span style={{ padding: '10px', display: 'flex'}}>

              {
                this.state.thumbnailFiles.length > 0 ?
                  (this.state.thumbnailFiles).map(imgObj => (
                        <div className='pic-input-div' key={imgObj.url}>
                          <img src={imgObj.url} alt="..." className='preview-image' />
                          {/* <input placeholder='picture label' 
                                 type='text' 
                                 name='pic-description' 
                                 className='pic-description' 
                                 onChange={this.handlePicDescriptionChange}
                          /> */}
                        </div>
                      ))
                
                :
                //space placeholder
                <div style={{height: '100px', width: '100px'}}></div>
              }  
            </span>         
            <div className='recommend-form'>
              <h4>Recommend this apartment?</h4>
              <div style={{display: 'flex', marginLeft: '10px'}}>
                <h4 style={{marginRight: '5px'}}>Yes</h4><input onChange={this.handleFormChange} name='aptFormWouldRecommend' type='radio' value='true' style={{marginRight: '5px'}}/>
                <h4 style={{marginRight: '5px'}}>No</h4><input onChange={this.handleFormChange} name='aptFormWouldRecommend' type='radio' value='false' />
              </div>
            </div>
            <button id='apt-details-btn'>Post Review</button>
            </div>
          </form>

        </div>
    )
  }
}

export default withUser(ReviewPage);
 