import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';
const debug = process.env.DEBUG || false;
Chart.defaults.global.defaultFontSize = 12;

export default class BarChartSentiment extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.chart = new Chart(this.props.id, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'sentiment score',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: true,
        position: 'bottom',
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero:false,
            min: -1,
            max: 1,
          }
        }],
        xAxes: [{
          gridLines: {
            display: false,
          }
        }]
      }
    }
  })
  }

  componentWillReceiveProps (props) {
    if (debug) { console.log('Bar chart will rec: ', props.data); }

    if(props.data.length > 0){
      this.chart.data = props.data[0];
      this.chart.update();
    }
  }

  render() {
    if (debug) { console.log('Bar chart is rendering.'); }
    return (
      <div className="report-container">
        <div className="report-header">{this.props.title}</div>
        <div className="report-content">
          <canvas id={this.props.id}></canvas>
        </div>
      </div>
    )
  }
}
