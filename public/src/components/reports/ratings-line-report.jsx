import React, { Component } from 'react';
import RatingsLineChart from './charts/ratings-line-chart.jsx';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import './report.css';
const debug = process.env.DEBUG || false;

const colors = [
  '#8CB369',
  '#f6ae2d',
  '#60afff',
  '#5B5F97',
  '#f26419',
];

const fieldMap = {
  physicalScore: {legend: 'Physical Score', axis: 'Rating', yAxisID: 'rating-y-axis'},
  emotionalScore: {legend: 'Emotional Score', axis: 'Rating', yAxisID: 'rating-y-axis'},
  sleepQuality: {legend: 'Sleep Quality', axis: 'Rating', yAxisID: 'rating-y-axis'},
  exerciseIntensity: {legend: 'Exercise Intensity', axis: 'Rating', yAxisID: 'rating-y-axis'},
  sentimentScore: {legend: 'Sentiment Analysis', axis: 'Sentiment', yAxisID: 'sentiment-y-axis'},
};

export default class RatingsLineReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [ ],
      journals: [ ],
    };
    this.entryType = this.props.type || 'combo';
    this.fields = this.props.fields;
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() { this.updateData(); }

  updateData() {
    axios.get('/api/entries', {
      params: {
        limit: 100,
        type: this.entryType || null
      },
      headers: {'Authorization': 'bearer ' + this.props.auth()}
    }).then(res => {
      this.filterData(res.data);
    });

    axios.get('/api/journal', {
      params: {limit: 5},
      headers: {'Authorization': 'bearer ' + this.props.auth()}
    }).then(res => {
      this.filterData(res.data, true);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lastFormSubmitted !== nextProps.lastFormSubmitted &&
        this.props.type === nextProps.lastFormSubmitted.name) {
      this.updateData();
    }
  }

  filterData(entries, journals) {
    if (debug) { console.log(entries); }
    var datasets = [ ];

    if(journals){
      var journalData = [];

        var data = { };
        _.each(entries, (entry, j) => {
          let day = moment(entries[j].datetime).startOf('day');
          if (day in data) {
            data[day].sum += entries[j]['sentimentScore'];
            data[day].count++;
          } else {
            data[day] = { };
            data[day].sum = entries[j]['sentimentScore'];
            data[day].count = 1;
          }
        });

        _.forIn(data, (value, key) => {
          journalData.push({x: new Date(key), y: ((value.sum / value.count).toFixed(2)/1)});
        });

      datasets.push({label: "Journal Sentiment", yAxisID: "sentiment-y-axis", pointBorderWidth: 3, borderDash: [2], borderDashOffset: 2, data: journalData, fill: false, borderColor: '#067E9A'});

      this.setState({journals: datasets});

    } else {

      _.each(this.fields, (field, i) => {
        datasets.push({label: fieldMap[field].legend, yAxisID: "rating-y-axis", data: [ ], fill: false, borderColor: colors[i]});

        var data = { };
        _.each(entries, (entry, j) => {
          let day = moment(entries[j].datetime).startOf('day');
          if (day in data) {
            data[day].sum += entries[j][field];
            data[day].count++;
          } else {
            data[day] = { };
            data[day].sum = entries[j][field];
            data[day].count = 1;
          }
        });

        _.forIn(data, (value, key) => {
          let decimal = value.sum / value.count
          if ( decimal % 1 != 0) {
            decimal = Math.round( decimal * 10 ) / 10;
          }
          datasets[i].data.push({x: new Date(key), y: decimal});
        });
      });

    if (debug) { console.log('Data created in report: ', datasets); }
    this.setState({data: datasets});
    }
  }

  render() {
    return (
      <div className="report-container">
        <div className="report-header">{this.props.title}</div>
        <div className="report-content">
          <RatingsLineChart data={this.state.data} journals={this.state.journals} id={`line-chart-${this.entryType.toLowerCase()}`}/>
        </div>
      </div>
    );
  }
}
