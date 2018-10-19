import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      kontrahent: {}
    };
  }

  componentDidMount() {
    axios.get('/api/kontrahent/'+this.props.match.params.id)
      .then(res => {
        this.setState({ kontrahent: res.data });
        console.log(this.state.kontrahent);
      });
  }

  onChange = (e) => {
    const state = this.state.kontrahent
    state[e.target.name] = e.target.value;
    this.setState({kontrahent:state});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { imie, naziwsko, miasto, } = this.state.kontrahent;

    axios.put('/api/kontrahent/'+this.props.match.params.id, { imie, naziwsko, miasto, })
      .then((result) => {
        this.props.history.push("/show/"+this.props.match.params.id)
      });
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-naziwsko">
              Edycja Kontrahenta
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to={`/show/${this.state.kontrahent._id}`}><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Powrót</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="imie">imie:</label>
                <input type="text" class="form-control" name="imie" value={this.state.kontrahent.imie} onChange={this.onChange} placeholder="imie" />
              </div>
              <div class="form-group">
                <label for="naziwsko">naziwsko:</label>
                <input type="text" class="form-control" name="naziwsko" value={this.state.kontrahent.naziwsko} onChange={this.onChange} placeholder="naziwsko" />
              </div>
              <div class="form-group">
                <label for="miasto">miasto:</label>
                <input type="text" class="form-control" name="miasto" value={this.state.kontrahent.miasto} onChange={this.onChange} placeholder="miasto" />
              </div>
              <button type="submit" class="btn btn-default">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;