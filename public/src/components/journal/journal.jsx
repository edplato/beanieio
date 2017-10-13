import React, { Component } from 'react';
import axios from 'axios';
import './journal.css';

export default class Journal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entry: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(e) {
    e && e.preventDefault();
    console.log(this.state.entry);
  }


  render() {
    return (
      <div className="journal-container">
        <div className="journal-header"><span>Journal</span></div>
          <div className="journal-content">
            <form onChange={e => this.setState({entry: e.target.value})}  onSubmit={this.handleSubmit} >
              <textarea placeholder="Enter a journal entry" />
              <input type="submit" />
            </form>
          </div>

      </div>
    )
  }
}
