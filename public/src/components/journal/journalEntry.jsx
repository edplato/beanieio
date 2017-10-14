import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import './journal.css';
import '../forms/form-styles.css';

export default class JournalEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journalEntry: '',
      isNewEntry: true,
      currentEntry: 0,
      entryDate: moment().calendar()
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageLeft = this.handlePageLeft.bind(this);
    this.handlePageRight = this.handlePageRight.bind(this);
  }

  componentDidMount() {
    this.props.getEntries();
  }

  handlePageLeft() {
    if (this.state.isNewEntry) {
      this.setState({isNewEntry: false});
      this.setState({journalEntry: this.props.entries[this.state.currentEntry].text});
    } else if (this.state.currentEntry + 1 < this.props.entries.length) {
      console.log('page left', this.props.entries);
      let currentIndex = this.state.currentEntry;
      this.setState({journalEntry: this.props.entries[this.state.currentEntry + 1].text});
      this.setState({currentEntry: this.state.currentEntry + 1});
      this.setState({entryDate: moment(this.props.entries[this.state.currentEntry + 1].datetime).calendar()})
    };
    console.log(this.state.currentEntry);
  }

  handlePageRight() {
    if (this.state.currentEntry === 0) {
      this.setState({isNewEntry: true});
      this.setState({journalEntry: ''});
      this.setState({entryDate: moment().calendar()});
    } else if (this.state.currentEntry > 0) {
      console.log('page right', this.props.entries);
      this.setState({journalEntry: this.props.entries[this.state.currentEntry - 1].text});
      this.setState({currentEntry: this.state.currentEntry - 1});
      this.setState({entryDate: moment(this.props.entries[this.state.currentEntry - 1].datetime).calendar()})
      console.log(this.state.currentEntry);
    };
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
          <span className="journalEntry-header-left"><i onClick={this.handlePageLeft} className="mdi mdi-arrow-left-bold"></i></span>
          <div className="journalEntry-header-center">{this.state.entryDate}</div>
          <span className="journalEntry-header-right"><i onClick={this.handlePageRight} className="mdi mdi-arrow-right-bold"></i></span>
        </div>
          <form className="journalEntry-content" onChange={e => this.setState({journalEntry: e.target.value})}  onSubmit={this.handleSubmit} >
            <textarea className="journalEntry-area" placeholder="How was your day?" value={this.state.journalEntry} />
            <div className="journal-submit-section flex flex-center">
              {this.state.isNewEntry ? (<button type="submit" className="btn journal-submit-btn shadow">Submit</button>) : (null) }
            </div>
          </form>
      </div>
    )
  }
}
