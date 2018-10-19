import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { request } from 'https';

var rp = require('request-promise');
var tzlookup = require("tz-lookup");



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      kontrahenci: [],
      apiKey : "52d3ba1967079559c83f9af88a095fb6",
      currentPage: 1,
      kontrahentsPerPage:10,
      query: '',
      key:"imie",
    };
    this.handleClick = this.handleClick.bind(this);
    this.sortBy = this.sortBy.bind(this);
    
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    })
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  
  sortBy(e){
    this.setState({key:e.target.id });
  }

  logout = () => {
  localStorage.removeItem('jwtToken');
  window.location.reload();
  }
  
  compareValues = ( key, order='asc') => {
    return function(a, b) {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
          return 0; 
      }
  
      const varA = (typeof a[key] === 'string') ? 
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ? 
        b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  componentWillMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('/api/kontrahent')
      .then(res => {
        console.log(res.data);

        res.data.map((kontrahent)=>{
          let options = {
            uri: 'http://api.openweathermap.org/data/2.5/weather?q='+kontrahent.miasto+"&appid="+this.state.apiKey,
            json: true
          }
          rp(options)
            .then((body)=>{
            
            let lat = body.coord.lat;
            let lon = body.coord.lon;
            let cityTimeZone =tzlookup(lat, lon);
            kontrahent.timeZone = new Date().toLocaleTimeString(undefined,{timeZone:cityTimeZone});
          }).catch((error)=>{
            kontrahent.timeZone="Can't find";
          }).then(()=>{this.setState({ kontrahenci: res.data });})
        
          
        })
      })
      .catch((error) => {
        if(error.response.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  

  render() {

    const { kontrahenci, currentPage, kontrahentsPerPage } = this.state;

        const unsortedKontrahenci = kontrahenci.filter((kontrahent=> kontrahent.imie.startsWith(this.state.query)
        || kontrahent.nazwisko.startsWith(this.state.query)
        || kontrahent.miasto.startsWith(this.state.query)))

        let sortedKontrahenci = unsortedKontrahenci.sort(this.compareValues(this.state.key));

        // Logic for displaying current kontrahenci
        const indexOfLast = currentPage * kontrahentsPerPage;
        const indexOfFirst = indexOfLast - kontrahentsPerPage;
        const currentKontrahenci = sortedKontrahenci.slice(indexOfFirst, indexOfLast);

        const renderKontrahenci = currentKontrahenci.map((kontrahent) => {
          return (
              <tr>
                <td><Link to={`/show/${kontrahent._id}`}>{kontrahent.imie}</Link></td>
                <td>{kontrahent.nazwisko}</td>
                <td className=" d-none d-sm-table-cell">{kontrahent.miasto}</td>
                <td className=" d-none d-sm-none d-md-table-cell">{kontrahent.timeZone}</td>
              </tr>
            )
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedKontrahenci.length / kontrahentsPerPage); i++) {
          pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
          return (
            <li class="page-item">
            <a className="page-link"
              key={number}
              id={number}
              onClick={this.handleClick}>
              {number}
            </a>
            </li>
          );
        });

    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>
              Kontrahenci &nbsp;
              {localStorage.getItem('jwtToken') &&
                <button class="btn btn-primary" onClick={this.logout}>Wyloguj</button>
              }
            </h3>
            <form>
            <input
              placeholder="Search for..."
              ref={input => this.search = input}
              onChange={this.handleInputChange}
            />
           </form>    
          </div>
          <div class="panel-body">
          <h4><Link to="/create"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Dodaj</Link></h4>
            <table class="table table-stripe">
              <thead>
                <tr>
                  <th>Imię <button type="button" id="imie"  onClick={ this.sortBy } class="btn btn-primary btn-sm">A-Z</button> </th>
                  <th>Nazwisko <button type="button" id="nazwisko" onClick={this.sortBy} class="btn btn-primary btn-sm">A-Z</button></th>
                  <th className=" d-none d-sm-table-cell">Miasto <button type="button" id="miasto" onClick={this.sortBy}class="btn btn-primary btn-sm">A-Z</button></th>
                  <th className=" d-none d-sm-none d-md-table-cell">Czas</th>
                </tr>
              </thead>
              <tbody>
              {renderKontrahenci}                
              </tbody>
            </table>
            <nav aria-label="Page navigation">
            <ul class="pagination">
              {renderPageNumbers}
            </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
