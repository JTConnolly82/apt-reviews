import React from 'react';
import './aptsearch.css'
import Select from 'react-select'
import {Link} from 'react-router-dom';
import axios from 'axios';
import {withUser} from '../context/UserProvider'



class AptSearchbar extends React.Component {
  constructor() {
    super();
    this.state = {
      aptNotFound: false,
      apts: [],
      searchbarApts: [],
      selectedApt: '',
    }
  }

  componentDidMount() {
    axios.get('/apartment')
      .then(res => {
        let newApts = [];
        for (let i = 0; i < res.data.length; i++) {
          newApts.push(res.data[i]);
        }
        this.setState({
          apts: newApts
        })
        let stagedSearchApts = this.state.apts.map((apt) => {
          return {value: apt._id, label: apt.street_address + " " + apt.apt_number}
        });
        this.setState({
          searchbarApts: stagedSearchApts
        })
      })
      .catch(err => console.error(err));
  }


  

  noOptions = () => {
    // return "Unit not found, want to add this location?"
    return (
      <>
        {this.props.token ? <>
                              <h3 className='noResultMessage'>We don't have this location yet</h3>
                              <Link className='noResultButton' to='/apartment'>Add Location</Link>
                            </>
        :
        <>
          <h3 className='noResultMessage'>Account info not found</h3>
          <Link className='noResultButton' to='/auth'>Login / Signup to add location</Link>
        </>
        }
      </>
    )
  }


  handleChange = (e) => {
    this.setState({
      selectedApt: ''
    })
    if (e != null) {
      let selection = e.label;
      let filteredApts = this.state.apts.filter((apt) => {
        return selection.includes(apt.street_address) && selection.includes(apt.apt_number);
      })
      this.setState({
        selectedApt: filteredApts[0]._id
      })
    }
  }

  searchApts = (e) => {
    e.preventDefault();
    
  }

  handleRemove = (e) => {
    e.preventDefault();
    this.setState({
      selectedApt: ''
    })
  }

  render() {
    return (
      <>
        <form onSubmit={this.searchApts}>
          <Select id='searchbar'
                  noOptionsMessage={this.noOptions}
                  isClearable={true} 
                  isSearchable={true}  
                  options={this.state.searchbarApts} 
                  placeholder='Search'
                  onChange={this.handleChange}
                  onRemove={this.handleRemove}
                  maxMenuHeight={'200px'}
                   />
          {this.state.selectedApt ? 
            <Link to={`/apartment/${this.state.selectedApt}`} id='search-button'><img id='search-png' src={process.env.PUBLIC_URL + '/search.png'} /></Link>
            :
            <Link to="/" id='search-button'><img id='search-png' src={process.env.PUBLIC_URL + '/search.png'} /></Link>
          }
        </form>
      </>
    )
  }
}


export default withUser(AptSearchbar);