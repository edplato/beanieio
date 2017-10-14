import React, { Component } from 'react';
import axios from 'axios';
import JournalEntry from './journalEntry.jsx';
import './journal.css';

export default class Journal extends Component {
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
      <div className="journal-container">
        <div className="journal-header"><span>Journal</span></div>
          <div className="journal-window">
            <JournalEntry getAuth={this.props.getAuth} />
          </div>
      </div>
    )
  }
}
