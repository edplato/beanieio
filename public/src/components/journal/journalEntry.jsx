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
      entryDate: moment().calendar(),
      leftArrow: true,
      rightArrow: false,
      audioButton: 'Click me to dictate speech'
    }
    // Arrow Functionality
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageLeft = this.handlePageLeft.bind(this);
    this.handlePageRight = this.handlePageRight.bind(this);

    // Speech to Text initialization functions
    let SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    let SpeechGrammarList = webkitSpeechGrammarList || SpeechGrammarList;
    let SpeechRecognitionEvent = webkitSpeechRecognitionEvent || SpeechRecognitionEvent;
    let recognizing = false;
    let final_transcript = '';

    let recognition = new SpeechRecognition();
    recognition.continous = true;
    recognition.interim = true;

    recognition.onstart = () => {
      this.recognizing = true;
      console.log('Speak now');
      this.setState({audioButton: 'Listening...'});
    }

    let capitalize = (string) => {
      let firstLetter = string[0].toUpperCase();
      return firstLetter + string.slice(1);
    }

    let punctuate = (string) => {
      let arr = string.split(" ");
      if (arr[0] === 'Who' || arr[0] === 'What' || arr[0] === 'When' || arr[0] === 'Where' || arr[0] === 'Why' || arr[0] === 'Would') {
        return string + '? ';
      }
      return string + '. ';
    }

    recognition.onresult = (event) => {
      let interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          let final_transcript = '';
          final_transcript += event.results[i][0].transcript;
          final_transcript = punctuate(capitalize(final_transcript));
          this.setState({journalEntry: this.state.journalEntry + final_transcript});
        } else {
          interim_transcript += event.results[i][0].transcript;
          console.log(interim_transcript);
          this.setState({audioButton: interim_transcript});
        }
      }
    }

    recognition.onspeechend = () => {
      console.log('Speech end');
      recognition.stop();
      this.setState({audioButton: 'Click me to dictate speech'});
    }

    recognition.onnomatch = (event) => {
      diagnostic.textContent = 'I did not recognize that.';
    }

    recognition.onerror = (event) => {
      diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    }

    this.startSpeech = () => {
      recognition.start();
    }

  }

  componentDidMount() {
    this.props.getEntries();
  }

  handlePageLeft() {
    if (this.state.isNewEntry) {
      this.setState({
        isNewEntry: false,
        journalEntry: this.props.entries[this.state.currentEntry].text,
        rightArrow: true
      });

    } else if (this.state.currentEntry + 1 < this.props.entries.length) {

      if (this.state.rightArrow === false) {
        this.setState({rightArrow: true});
      }
      if (this.state.currentEntry + 2 === this.props.entries.length) {
        this.setState({leftArrow: false});
      }

      let currentIndex = this.state.currentEntry;
      this.setState({
        journalEntry: this.props.entries[this.state.currentEntry + 1].text,
        currentEntry: this.state.currentEntry + 1,
        entryDate: moment(this.props.entries[this.state.currentEntry + 1].datetime).calendar()
      });

    }
  }

  handlePageRight() {
    if (this.state.currentEntry === 0) {
      this.setState({
        isNewEntry: true,
        journalEntry: '',
        entryDate: moment().calendar(),
        rightArrow: false
      });

    } else if (this.state.currentEntry > 0) {
      if (this.state.leftArrow === false) {
        this.setState({leftArrow: true});
      }
      this.setState({
        journalEntry: this.props.entries[this.state.currentEntry - 1].text,
        currentEntry: this.state.currentEntry - 1,
        entryDate: moment(this.props.entries[this.state.currentEntry - 1].datetime).calendar()
      });
    };
  }


  handleSubmit(e) {
    e && e.preventDefault();
    let formData = {
      journalEntry: this.state.journalEntry,
      datetime: new Date(),
    };
    if (formData.journalEntry !== '') {
      axios.post('/api/language', formData, {headers: {'Authorization': 'bearer ' + this.props.getAuth()}})
      .then((res) => {
        console.log('Received from server: ', res);
      }).catch((err) => console.log('error: ', err));
    }
  }



  render() {
    return (
      <div className="journalEntry-container shadow">
        <div className="journalEntry-header">

          {this.state.leftArrow ? (
            <span className="journalEntry-header-left">
              <i onClick={this.handlePageLeft} className="mdi mdi-arrow-left-bold"></i>
            </span>) : (null)}

          <div className="journalEntry-header-center">{this.state.entryDate}</div>

          {this.state.rightArrow ? (
          <span className="journalEntry-header-right">
            <i onClick={this.handlePageRight} className="mdi mdi-arrow-right-bold"></i>
          </span>) : (null)}

        </div>
          <form className="journalEntry-content" onChange={e => this.setState({journalEntry: e.target.value})}  onSubmit={this.handleSubmit} >
            <textarea className="journalEntry-area" placeholder="How was your day?" value={this.state.journalEntry} />
            <div className="journal-submit-section flex flex-center">
              {this.state.isNewEntry ? (<button type="submit" className="btn journal-submit-btn shadow">Submit</button>) : (null) }
            </div>
            <button className="btn journal-audio-btn shadow" onClick={this.startSpeech}>{this.state.audioButton}</button>
          </form>
      </div>
    )
  }
}
