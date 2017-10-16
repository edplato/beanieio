import React, { Component } from 'react';
import ComboLineReport from './combo-line-report.jsx';
import ComboPieReport from './combo-pie-report.jsx';
import BarChartSentiment from './charts/bar-chart-sentiment.jsx';
import { DropdownList } from 'react-widgets';
import axios from 'axios';
import moment from 'moment';
import classNames from 'classnames';
import './report-dashboard.css';
const debug = process.env.DEBUG || false;

export default class ReportDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feelings: [ ],
      journals: [ ],
      feeling: null,
      data: { },
    };
    this.handleFeeling = this.handleFeeling.bind(this);
  }

  componentDidMount() {
    this.getUserConfig();
  }

  getUserConfig() {
    axios.get('/api/users/formconfig',
      {headers: {'Authorization': 'bearer ' + this.props.getAuth()}}
    ).then(resp => {
      const data = resp.data;
      let feelings = [ ];
      data.emotional.forEach(feeling => feelings.push({group: 'Emotional', field: 'emotionalTags', text: feeling}));
      data.physical.forEach(feeling => feelings.push({group: 'Physical', field: 'physicalTags', text: feeling}));
      this.setState({
        feelings: feelings
      });
    });

    axios.get('/api/journal', {
      params: {limit: 50},
      headers: {'Authorization': 'bearer ' + this.props.getAuth()}
    }).then(res => {
      this.filterData(res.data);
    });
  }

  handleFeeling() {
    axios.get('/api/reports/correlation', {
      params: {
        feeling: this.state.feeling.text,
        type: this.state.feeling.field,
      },
      headers: {'Authorization': 'bearer ' + this.props.getAuth()}
    }).then(res => {
      this.setState({data: res.data});
      if (debug) { console.log(res.data); }
    });
  }

  filterData(entries) {
    if (debug) { console.log(entries); }
    var datasets = [ ];

    var labels = [];
    var sentimentData = [];
    var backgroundColor = [];
    var borderColor = [];

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

      let averageSentiment = ((value.sum / value.count).toFixed(2)/1);

      if(averageSentiment !== 0) {
        sentimentData.unshift(averageSentiment);

        let utcdate = new Date(key);
        let date = moment(utcdate).format('L');
        labels.unshift(date);

        let bgcolor;
        let bordercolor;

        if(averageSentiment < 0) {
          bgcolor = 'rgba(255, 99, 132, 0.2)';
          bordercolor = 'rgba(255,99,132,1)';
        } else if(averageSentiment > 0) {
          bgcolor = 'rgba(54, 162, 235, 0.2)';
          bordercolor = 'rgba(54, 162, 235, 1)';
        }
        backgroundColor.unshift(bgcolor);
        borderColor.unshift(bordercolor);
      }
    });

    datasets.push({
      labels: labels,
      datasets: [{
        label: 'sentiment score',
        data: sentimentData,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2
      }]
    });

    this.setState({journals: datasets});
  }

  render() {
    return (
      <div className="dashboard-container">
        <div className="report-bar-wrapper">
          <div className="report-bar-label">Correlate observations with:</div>
          <div className="report-bar-dropdown">
            <DropdownList
              value={this.state.feeling} data={this.state.feelings}
              textField="text" groupBy="group"
              onChange={feeling => {
                this.setState({feeling}, this.handleFeeling);
              }} />
          </div>
        </div>
        <div className="dashboard-window">
          <div className="report-tile report-tile-wide shadow"><ComboLineReport data={this.state.data} title="Summary:" feeling={this.state.feeling ? this.state.feeling.text : ''}/></div>
          <div className="report-tile shadow"><ComboPieReport data={this.state.data.mealMatches} type="Meal" title="Ingredients:"/></div>
          <div className="report-tile shadow"><ComboPieReport data={this.state.data.pulseMatches} type="PulseEmo" title="Emotional tags:"/></div>
          <div className="report-tile shadow"><ComboPieReport data={this.state.data.pulseMatches} type="PulsePhys" title="Tags:"/></div>
          <div className="report-tile shadow"><BarChartSentiment data={this.state.journals} id="sentiment" title="Positive/Negative Journal Sentiment Analysis:"/></div>
        </div>
      </div>
    );
  }
}
