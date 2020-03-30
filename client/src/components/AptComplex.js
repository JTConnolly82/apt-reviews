import React from 'react';
// import {Link} from 'react-router-dom';
// import Select from 'react-select';
import AptCard from './AptCard';
import axios from 'axios';
import './aptcomplex.css';



class AptComplex extends React.Component {
  constructor () {
    super();
    this.state = {
      complex: '',
      apartmentUnits: []
    }
  }

  componentDidMount() {
    let {_id} = this.props.match.params
    axios.get(`/aptcomplex/${_id}`).then(res => {
      console.log(res.data)
      this.setState({
        complex: res.data,
      })
      let complexId = res.data._id
      return complexId
    })
      .then((complexId) => {
        axios.get(`/apartment/wherecomplex/${complexId}`).then(res => {
          console.log('complex apts ', res.data)
          this.setState({
            apartmentUnits: res.data
          })
        })
    })
    .then(() => {
      // let units = this.state.apartmentUnits.concat();
      // console.log('units', units)
      // let mappedApts = units.map((apt) => {
      //   console.log(apt)
      //   return (
      //     <div>
      //       <h2>hi hello</h2>
      //     </div>
      //   )
      // })
      // return mappedApts
    }
    )
    .catch((err) => {
      console.dir(err);
    })
  };

  
  handleWebsite = () => {
    window.location.replace('http://' + this.state.complex.website)
  }

  render() {

      
    // let units = this.state.apartmentUnits.concat();
    // console.log('units', units)
    // let mappedApts = units.map((apt) => {
    //   console.log(apt)
    //   return (
    //     <div>
    //       <h2>hi hello</h2>
    //     </div>
    //   )
    // })

  
    let mappedUnits = this.state.apartmentUnits.map((unit) => {
      return (
        <AptCard key={Math.random() * 6000} {...unit} />
      )
    })
    

    return (
      <div>
        <div className='complex-title-div'>
          <h1 id='complex-title'>{this.state.complex.name}</h1>
          <a id='complex-website-link' target='_blank' href={`http://${this.state.complex.website}`}>Visit Website</a>
       <div id='title-divider-div'></div>
        </div>
        <div className='apartment-units'>
          <div style={{marginTop: '20px', marginBottom: '20px'}}>
            Apartments in {this.state.complex.name}
          </div>
          {mappedUnits}
        </div>
      </div>
    )
  }


}

export default AptComplex;
