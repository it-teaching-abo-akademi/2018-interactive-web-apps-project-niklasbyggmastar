import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import 'react-confirm-alert/src/react-confirm-alert.css';

// Graph object, used the react-chartjs-2 with chart.js
const LineGraph = (props) => {
  const data = {
    labels: props.time,
    datasets: [
      {
        label: props.symbol,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: props.values
      }
    ]
  };

  return (
    <Line height={280} data={data} />
  )
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.apiKey = "AH3A612TPNUUG8DZ";
    // Get the portfolio id and stock id from the url
    this.portfolio_id = props.match.params.id;
    this.stock_id = props.match.params.stock_id;
    this.state = {};
    this.values = [];

    // Get the stored portfolios and store in the state
    if (typeof (Storage) !== "undefined" && localStorage.length !== 0) {
      this.state.portfolio = JSON.parse(localStorage.getItem("portfolios"))[this.portfolio_id];
    }
    console.log(this.state.portfolio);
    // Set the stock variable using the stock id
    this.stock = this.state.portfolio.stocks[this.stock_id];
    // If there are stocks, get the data from the API
    if (this.stock){
      this.url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.stock.name + "&interval=5min&apikey=" + this.apiKey;
      this.getData();
    } 
  }

  // Get the stock data from the api
  getData = async () => {
    const api_call = await fetch(this.url);
    await api_call.json().then(data => {
      console.log(data);
      this.values = data['Time Series (Daily)'];
      this.setState({
        values: this.values
      });
    }).catch(error => {
      console.warn(error);
    });
  }

  // Set the state with values
  componentWillMount() {
    this.setState({
      values: this.values
    })
  }

  // Back button takes to the portfolio
  backToPortfolio = () => {
    this.props.history.push("/portfolio/" + this.portfolio_id);
  }

  render() {
    let values = this.state.values;
    let stock = this.stock;
    let valuesArray = [];
    let timeArray = [];

    // If there are values, iterate through the values array and put the stock values and
    // the corresponding dates to arrays
    if (values){
      Object.keys(values).map((key)=> {
        let item = parseFloat(values[key]['4. close']);
        let time = key;
        valuesArray.unshift(item);
        timeArray.unshift(time);
      })
    }else{
      alert("Stock data is currently unavailable, please try again later");
    }
    
    // Current value will be the last item in the values array
    let currentValue = valuesArray[valuesArray.length-1];

    return (
      <div>
        {/* If the stock exists, show the data */}
        {stock &&
          <div>
            <span onClick={() => this.backToPortfolio()} className="backBtn"><i className="fas fa-arrow-left mb-3"></i> back</span>
            <h4>Stock: {this.stock.name}</h4>
            <h6>Current value: {currentValue} €</h6>
            {/* The line graph component is rendered here with the desired properties */}
            <LineGraph symbol={stock.name} values={valuesArray} time={timeArray} />
          </div>
        }
        {/* If the stock does not exist */}
        {!stock &&
          <h4>This stock does not exist</h4>      
        }

      </div>
    );
  }
}

