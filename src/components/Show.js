import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

var rp = require('request-promise');
var tzlookup = require("tz-lookup");
let weather= {};

class Show extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apiKey : "52d3ba1967079559c83f9af88a095fb6",
      kontrahent: {}
    };
  }

  componentDidMount() {
    axios.get('/api/kontrahent/'+this.props.match.params.id)
      .then(res => {
        let options = {
            uri: 'http://api.openweathermap.org/data/2.5/weather?q='+res.data.miasto+"&appid="+this.state.apiKey,
            json: true
        }
        rp(options) // sending request promise to weather API to obtain informations about weather.
        .then((body)=>{
            let lat = body.coord.lat;
            let lon = body.coord.lon;
            weather.type=body.weather[0].description;
            weather.temp=body.main.temp;
            console.log(body.weather[0].description);
            console.log(body)
            let cityTimeZone =tzlookup(lat, lon); // check time zone with tzlookup
            res.data.timeZone = new Date().toLocaleTimeString(undefined,{timeZone:cityTimeZone});
          }).catch((error)=>{ // handle bad cities
            console.log(error);
            res.data.timeZone="Can't find";
            weather.type="Nope";
            weather.temp="Nope"
          }).then(()=>{this.setState({ kontrahent: res.data });})

      });
  }

  delete(id){
    console.log(id);
    axios.delete('/api/kontrahent/'+id)
      .then((result) => {
        this.props.history.push("/")
      });
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              {this.state.kontrahent.title}
            </h3>
          </div>
          <div className="row">
            <div class="panel-body col-sm-6">
                <h4><Link to="/"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> Powrót do listy</Link></h4>
                <dl>
                <dt>imie:</dt>
                <dd>{this.state.kontrahent.imie}</dd>
                <dt>nazwisko:</dt>
                <dd>{this.state.kontrahent.nazwisko}</dd>
                <dt>miasto:</dt>
                <dd>{this.state.kontrahent.miasto}</dd>
                </dl>
                </div>
                <div className="panel-body col-sm-6">
                    <dl>
                        <dt>Pogoda dla {this.state.kontrahent.miasto}:</dt> 
                        <dd>{weather.type}</dd>
                        <dd>{Math.floor(weather.temp - 273)} C</dd>
                        <dt>Aktualny czas: {this.state.kontrahent.timeZone}</dt>
                    </dl>

                </div>
            </div>
            <div className="pane-body">
                <Link to={`/edit/${this.state.kontrahent._id}`} class="btn btn-success">Edytuj</Link>&nbsp;
                <button onClick={this.delete.bind(this, this.state.kontrahent._id)} class="btn btn-danger">Usuń</button>
          
            </div>

        </div>
      </div>
    );
  }
}

export default Show;