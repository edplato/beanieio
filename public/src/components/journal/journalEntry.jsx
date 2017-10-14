import React, { Component } from 'react';
import axios from 'axios';
import './journal.css';
import '../forms/form-styles.css';

export default class JournalEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journalEntry: '',
      isNewEntry: true
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
        <div className="journalEntry-header">
          <span className="journalEntry-header-left"><i className="mdi mdi-arrow-left-bold"></i></span>
          <span className="journalEntry-header-center">New Entry</span>
          <span className="journalEntry-header-right"><i className="mdi mdi-arrow-right-bold"></i></span>

        </div>
          <div className="journalEntry-content">
            <form onChange={e => this.setState({journalEntry: e.target.value})}  onSubmit={this.handleSubmit} >
              <textarea className="journalEntry-area" placeholder="How was your day?" />
              <div className="journal-submit-section flex flex-center">
                {this.state.isNewEntry ? (<button type="submit" className="btn journal-submit-btn shadow">Submit</button>) : (null) }
              </div>
            </form>
          </div>

      </div>
    )
  }
}
