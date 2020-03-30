import React from "react";
import axios from "axios";
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import { withUser } from "../context/UserProvider";
import "./reviewpage.css";

class ReviewPage extends React.Component {
  constructor() {
    super();
    this.state = {
      apt: {},
      wouldRecommend: "",
      reviews: [],
      _id: "",
      aptFormTitle: "",
      aptFormDescription: "",
      aptFormRating: 0,
      files: [],
      imageDescriptions: [],
      thumbnailFiles: [],
      response: ''
    };
  }

  componentDidMount() {
    let { _id } = this.props.match.params;
    axios.get(`/apartment/${_id}`).then(res => {
      this.setState({
        apt: res.data
      });
    });
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

  // handleFormChange = (e) => {
  //   const {name, value} = e.target;
  //   this.setState({ [name]: value })
  // }

  handlePicDescriptionChange = e => {};

  handleFiles = e => {
    let thumbnailStagingArray = [];
    for (let i = 0; i < e.target.files.length; i++) {
      thumbnailStagingArray.push({
        url: URL.createObjectURL(e.target.files[i])
      });
    }

    this.setState({ thumbnailFiles: thumbnailStagingArray });

    let fileArr = [];
    fileArr.push(e.target.files);
    this.setState({
      files: [...fileArr]
    });
  };

  handleFormChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRating = () => {
    this.setState({
      // aptFormRating: 
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    // const formData = new FormData();
    //     formData.append('myImage',this.state.file);

    //config for text going to mongo
    let config = {
      headers: {
        Authorization: "bearer " + this.props.token
      }
    };
    // config for files going to s3
    let filesConfig = {
      headers: {
        Authorization: "bearer " + this.props.token,
        "Content-Type": "multipart/form-data"
      }
    };

    

    let responseMsg;

    if (this.state.files.length > 0) {
      let formData = new FormData();
    for (let i = 0; i < this.state.files[0].length; i++) {
      formData.append("file", this.state.files[0][i]);
    }
    axios
      .post("/api/reviewImages", formData, filesConfig)
      .then(res => {
        let reviewObj = {
          title: this.state.aptFormTitle,
          apt: this.state.apt._id,
          description: this.state.aptFormDescription,
          starRating: this.state.aptFormRating,
          images: res.data
        };
        axios
          .post("/api/review", reviewObj, config)
          .then(res => {
            this.setState({
              aptFormTitle: "",
              aptFormDescription: "",
              aptFormRating: 0,
              files: null
            });
            this.props.history.push("/apartment/" + this.state.apt._id);
          })
          .catch(err => console.dir(err));
      });
    } else {
      let reviewObj = {
        title: this.state.aptFormTitle,
        apt: this.state.apt._id,
        description: this.state.aptFormDescription,
        starRating: this.state.aptFormRating
      }
      axios
          .post("/api/review", reviewObj, config)
          .then(res => {
            this.setState({
              aptFormTitle: "",
              aptFormDescription: "",
              aptFormRating: 0,
              files: null
            });
            this.props.history.push("/apartment/" + this.state.apt._id);
          })
          .catch(err => console.dir(err));
    }
    
  };

  render() {
    let aptNum = this.state.apt.apt_number;
    let stAddress = this.state.apt.street_address;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2 style={{fontSize: '22px', textAlign: 'center', marginTop: '100px'}}>{`Leave your review ${stAddress ? "for " + stAddress : ""} ${
          aptNum ? aptNum : ""
        } below 🏘`}</h2>

        <form className="apt-details-form" onSubmit={this.handleSubmit}>
          <div className="form-inner-div">
            <input
              onChange={this.handleFormChange}
              id="title-input"
              name="aptFormTitle"
              value={this.state.aptFormTitle}
              placeholder="review title"
            />
            <textarea
              onChange={this.handleFormChange}
              id="description-input"
              name="aptFormDescription"
              value={this.state.aptFormDescription}
              placeholder="review description"
            />
            <input
              name="files"
              type="file"
              onChange={this.handleFiles}
              style={{ marginBottom: "20px" }}
              multiple
            />
            <span style={{ display: "flex" }}>
              {this.state.thumbnailFiles.length > 0 ? (
                this.state.thumbnailFiles.map(imgObj => (
                  <div className="pic-input-div" key={imgObj.url}>
                    <img
                      src={imgObj.url}
                      alt="image"
                      className="preview-image"
                    />
                    {/* <input placeholder='picture label' 
                                 type='text' 
                                 name='imageDescriptions' 
                                 className='pic-description' 
                                 onChange={this.handlePicDescriptionChange}
                          /> */}
                  </div>
                ))
              ) : (
                //space placeholder
                <div style={{ height: "100px", width: "100px" }}></div>
              )}
            </span>
            <div className="recommend-form">
              <h4>Rating: </h4>
              <div style={{ display: "flex", marginLeft: "10px" }}>
               <Rater total={5} rating={this.state.aptFormRating} onRate={(rating)=>this.setState({aptFormRating: rating.rating})}/>
              </div>
            </div>
            <button id="apt-details-btn">Post Review</button>
          </div>
        </form>
      </div>
    );
  }
}

export default withUser(ReviewPage);