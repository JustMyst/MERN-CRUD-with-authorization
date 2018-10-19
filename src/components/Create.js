import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Create extends Component {

  constructor() {
    super();
    this.state = {
      imie: '',
      nazwisko: '',
      miasto: '',
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { imie, nazwisko, miasto, } = this.state;

    axios.post('/api/kontrahent', { imie, nazwisko, miasto,  })
      .then((result) => {
        this.props.history.push("/")
      });
  }

  render() {
    const { imie, nazwisko, miasto,} = this.state;
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              Dodaj Kontrahenta
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> Kontrahenci</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="imie">Imie:</label>
                <input type="text" class="form-control" name="imie" value={imie} onChange={this.onChange} placeholder="imie" />
              </div>
              <div class="form-group">
                <label for="nazwisko">Nazwisko:</label>
                <input type="text" class="form-control" name="nazwisko" value={nazwisko} onChange={this.onChange} placeholder="nazwisko" />
              </div>
              <div class="form-group">
                <label for="miasto">Miasto:</label>
                <input type="text" class="form-control" name="miasto" value={miasto} onChange={this.onChange} placeholder="miasto" />
              </div>
              
              <button type="submit" class="btn btn-default">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;