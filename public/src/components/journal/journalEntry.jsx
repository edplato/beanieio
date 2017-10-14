import React, { Component } from 'react';
import axios from 'axios';
import './journal.css';

export default class JournalEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journalEntry: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(e) {
    e && e.preventDefault();
    let formData = {
      journalEntry: this.state.journalEntry,
      datetime: new Date(),
    };

    axios.post('/api/language', formData, {headers: {'Authorization': 'bearer ' + this.props.getAuth()}})
      .then((res) => {
        console.log('Received from server: ', res);
      }).catch((err) => console.log('error: ', err));
  }


  render() {
    return (
      <div className="journalEntry-container shadow">
        <div className="journalEntry-header"><span>New Entry</span></div>
          <div className="journalEntry-content">
            <form onChange={e => this.setState({journalEntry: e.target.value})}  onSubmit={this.handleSubmit} >
              <textarea className="journalEntry-area" placeholder="Enter a journal entry" />
              <input type="submit" />
            </form>
          </div>

      </div>
    )
  }
}
