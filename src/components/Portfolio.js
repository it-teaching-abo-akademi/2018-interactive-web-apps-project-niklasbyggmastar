import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class Home extends Component {

  // Constructor for making global variables
  constructor(props){
    super(props);
    this.state = {
      name:"",
      numOfShares: 0,
      portfolio: {
        name: "",
        totalValue: 0,
        stocks: [{
          name: "",
          numOfShares: 0,
          currentValue: 0
        }]
      }
    };
    this.url = "";
    this.values = [];
    this.valuesArray = [];
    this.currentValue = 0;
    this.currentValues = [];
    this.portfolioValue = 0;
    // Get the portfolio id from the url
    this.id = props.match.params.id;
    this.counter = 0;

    // Needed for these two functions to work
    this.symbolChange = this.symbolChange.bind(this);
    this.numOfSharesChange = this.numOfSharesChange.bind(this);

    // Get stored portfolios and set the state so that the portfolios will be updated in the view
    if (typeof (Storage) !== "undefined" && localStorage.length !== 0) {
      this.state.portfolio = JSON.parse(localStorage.getItem("portfolios"))[this.id];
    }
    console.log(this.state.portfolio);
    this.apiKey = "AH3A612TPNUUG8DZ";
  }

  // Confirmation popup for removing the portfolio, used react-confirm-alert library
  confirmRemovePortfolio = (e) => {
    confirmAlert({
      title: 'Confirm to remove',
      message: 'Are you sure to remove this portfolio? All of the stocks inside it will also be removed.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.removePortfolio(e)
        },
        {
          label: 'No'
        }
      ]
    })
  }

  // Called if user selects 'yes' on the confirmation, removes the portfolio.
  // First set the stored portfolios to the global variable and remove the specified portfolio from that
  // and then overwrite the new portfolios array to the local storage
  removePortfolio = (e) => {
    e.preventDefault();
    if (typeof (Storage) !== "undefined" && localStorage.length !== 0) {
      this.portfolios = JSON.parse(localStorage.getItem("portfolios"));
      this.portfolios.splice(this.id, 1);
      localStorage.setItem("portfolios", JSON.stringify(this.portfolios));
      // Redirect to home page
      this.props.history.push("/");
    }
  }

  // When user writes the symbol, set the state
  symbolChange(e) {
    e.preventDefault();
    this.setState({name: e.target.value});
  }

  // When user writes the number of shares, set the state
  numOfSharesChange(e) {
    e.preventDefault();
    this.setState({numOfShares: e.target.value}); 
  }

  // Add stocks popup dialog, gets the symbol and number of shares
  showAddStocksDialog = (e) => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='addStockDiv'>
            <h1>Add a stock</h1>
            {/* When form is submitted, call addStocks and close the dialog */}
            <form onSubmit={()=>{
              this.addStocks()
              onClose()
              }} className="form-group">
              <label htmlFor="symbol">Symbol</label>
              <input value={this.state.symbol} onChange={this.symbolChange} type="text" className="form-control" />
              <label htmlFor="numOfShares">Number of shares</label>
              <input value={this.state.num} onChange={this.numOfSharesChange} type="number" className="form-control mb-3" />
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <input type="submit" value="Add" className="btn btn-success w-50 float-right" />
            </form>
          </div>
        )
      }
    })
  }

  addStocks = () => {
    let stockName = this.state.name;
    let numOfShares = this.state.numOfShares;
    // Check if the stock name and quantity are entered
    if (stockName.length > 0 && numOfShares.length > 0) {
      // Check if the stock name length is 3 or 4
      if (stockName.length >= 3 && stockName.length <= 4){
        // Get the current portfolio
        let portfolio = this.state.portfolio;
        console.log(portfolio.stocks.length);
        if (portfolio.stocks.length >= 50) {
          // Push the stock item to the stocks array in the portfolio if there's less than 50 stock symbols
          portfolio.stocks.push({
            name: stockName,
            numOfShares: numOfShares
          });
          this.setState({
            portfolio: portfolio
          })
          console.log(portfolio);
          // Get the stored portfolios array and overwrite the specified portfolio with new data 
          //and then overwrite the stored portfolios array
          let portfolios = JSON.parse(localStorage.getItem("portfolios"));
          portfolios[this.id] = portfolio;
          localStorage.setItem("portfolios", JSON.stringify(portfolios));
          this.setState({
            name: "",
            numOfShares: 0
          })
        }else{
          alert("Can not have more than 50 symbols in a portfolio");
        }
      }else{
        alert("Symbol must be 3 or 4 characters long");
      }
    }else{
      alert("Please fill in all the fields");
    }
  }

  // Confirmation popup dialog for removing a stock
  confirmRemoveStock = (e,i) => {
    confirmAlert({
      title: 'Confirm to remove',
      message: 'Are you sure to remove this stock?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.removeStock(e,i)
        },
        {
          label: 'No'
        }
      ]
    })
  }

  // Removes the specified stock
  // Get the stored portfolios array and overwrite with new portfolio where the stock has been deleted
  removeStock = (e,i) => {
    e.preventDefault();
    let portfolio = this.state.portfolio;
    this.state.portfolio.stocks.splice(i,1);
    console.log(this.state.portfolio);
    this.setState({
      portfolio: portfolio
    })
    let portfolios = JSON.parse(localStorage.getItem("portfolios"));
    portfolios[this.id] = portfolio;
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
  }

  // Confirmation popup dialog for removing the portfolio
  confirmRemovePortfolio = (e) => {
    e.preventDefault();
    confirmAlert({
      title: 'Confirm to remove',
      message: 'Are you sure to remove this portfolio? All of the stocks inside it will also be removed.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.removePortfolio(e)
        },
        {
          label: 'No'
        }
      ]
    })
  }

  // Take the user to the stock details page
  showStock = (e,i) => {
    e.preventDefault();
    this.props.history.push("/portfolio/"+this.id+"/stock/"+i);
  }

  // Get the stock current values from the API
  getValues = (symbol,i) => {
    this.url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&interval=5min&apikey=" + this.apiKey;
    this.getData().then(res=>{
      this.currentValue = res[0];
      // To avoid infinite loop (more like a quick hack than something smart)
      if (this.counter === 1) {
        console.log(res);
        let portfolio = this.state.portfolio;
        portfolio.stocks[i].currentValue = this.currentValue;
        this.setState({portfolio: this.state.portfolio});
        this.counter++;
      }
      
    });
    
  }

  // Get the data from the API and return an array that contains all the values
  getData = async () => {
    const api_call = await fetch(this.url);
    await api_call.json().then(data => {
      this.values = data['Time Series (Daily)'];
      Object.keys(this.values).map((key)=> {
        // Used the 4. close values
        let value = parseFloat(this.values[key]['4. close']);
        this.valuesArray.push(value);
      })
    }).catch(error => {
      console.warn(error);
    });
    return this.valuesArray;
  }

  // For getting the full portfolio value, not working but tried something...
  getPortfolioValue () {
    // To avoid infinite loop (more like a quick hack than something smart)
    if (this.counter === 0){
      let stocks = this.state.portfolio.stocks;
      for (let i=0; i< stocks.length;i++){
        console.log(stocks[i]);
        let value = stocks[i].currentValue;
        let quantity = parseFloat(stocks[i].numOfShares);
        console.log(value, quantity);
        this.portfolioValue += value*quantity;
      }
      this.counter++;
      console.log(this.portfolioValue);
      let portfolio = this.state.portfolio;
      portfolio.totalValue = this.portfolioValue;
      this.setState({
        portfolio: portfolio
      })
    }
  }

  // Back button link to home page
  backToHome = () => {
    this.props.history.push("/");
  }

  componentDidMount (){
    this.setState({
      values: this.values,
      currentValue: this.currentValue
    })
  }

	render() {
    let portfolio = this.state.portfolio;
    console.log(portfolio);
		return (
			<div>
        <span onClick={() => this.backToHome()} className="backBtn"><i className="fas fa-arrow-left mb-3"></i> back</span>
        {/* If the given portfolio exists */}
        { portfolio &&
          <div>
            <h4 className="mb-3">Portfolio: {portfolio.name}</h4>
            {/* If the portfolio contains stocks, show them */}
            { portfolio && portfolio.stocks.length > 0 &&
              <div>
                <h5>
                  Stocks
                  {/* If there's max 50 stocks, show the add stocks button */}
                  {portfolio.stocks.length <= 50 &&
                    <i className="fas fa-plus float-right btn btn-success" onClick={(e)=>this.showAddStocksDialog(e)}></i>
                  }
                </h5>
                {/* Table that contains all the stock data */}
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Unit value</th>
                      <th>Total value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Iterate through the stocks array and show each one's details */}
                    {portfolio.stocks.map((stock, i) =>
                      <tr key={i}>
                        {this.getValues(stock.name,i)}
                        <th onClick={e=>this.showStock(e,i)}>{stock.name}</th>
                        <th onClick={e=>this.showStock(e,i)}>{stock.numOfShares}</th>
                        <th onClick={e=>this.showStock(e,i)}>{stock.currentValue} €</th>
                        <th onClick={e=>this.showStock(e,i)}>{stock.currentValue*stock.numOfShares} €</th>
                        {/* Remove stock button for each row */}
                        <th>
                          <i onClick={e=>this.confirmRemoveStock(e,i)} className="fas fa-trash"></i>
                        </th>
                      </tr>
                    )}
                  <tr>
                    <th>Portfolio value</th>
                    <th></th>
                    <th></th>
                    <th>{this.getPortfolioValue()} €</th>
                    <th></th>
                  </tr>
                  </tbody>
                </table>
              </div>
            }
            {/* If there are no stocks in the portfolio */}
            { portfolio.stocks.length === 0 &&
              <div>
                <h4>You don't have any stocks in this portfolio</h4>
                <button type="button" className="btn btn-success mb-3" onClick={(e)=>this.showAddStocksDialog(e)}>Add stocks</button>
              </div>
            }
            <button type="button" className="btn btn-danger" onClick={(e)=>this.confirmRemovePortfolio(e)}>Remove portfolio</button>
          </div>
        }
        {/* If the given portfolio does not exist */}
        { !portfolio &&
          <h4>This portfolio does not exist</h4>
        }
        
			</div>
		);
	}
}

