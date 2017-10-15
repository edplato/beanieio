import React, { Component } from 'react';
import axios from 'axios';
import JournalEntry from './journalEntry.jsx';
import './journal.css';

export default class Journal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
    this.filterData = this.filterData.bind(this);
    this.getEntries = this.getEntries.bind(this);
  }

  getEntries() {
    axios.get('/api/journal', {
      params: { limit: 50},
      headers: {'Authorization': 'bearer ' + this.props.getAuth()}
    }).then(res => {
      this.filterData(res.data);
    });
  }

  filterData(data) {
    this.setState({entries: data});
    console.log(this.state.entries);
  }



  render() {
    return (
      <div className="journal-container">
        <div className="journal-header"><span>Journal</span></div>
          <div className="journal-window">
            <JournalEntry entries={this.state.entries} getEntries={this.getEntries} getAuth={this.props.getAuth} />
          </div>
      </div>
    )
  }
}
