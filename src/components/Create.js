import React, { Component } from 'react';

export default class Create extends Component {

	// Needed for global variables
	constructor(props) {
		super(props);
		this.portfolios = [];
	}

	/**
	 * Save function takes a name for the portfolio, an empty stocks array is created in the portfolio
	 */
	save = (e) => {
		e.preventDefault();
		let name = this.refs.name.value;
		if (!name){
			alert("Enter a name!");
			return;
		}
		// Data object representing a portfolio that is attached to the portfolios array
		let data = {
			name: name,
			stocks: []
		}
		
		// Check if there are 10 (or more) portfolios and cancel the saving if there is
		if (this.portfolios.length >= 10) {
			console.log("Too many portfolios!");
			alert("Can not create more than 10 portfolios");
			return;
		}
		// Add portfolio to the array
		this.portfolios.push(data);

		// Set the app state
		this.setState({
			state: this.portfolios
		});

		// Save the portfolio array to local storage. If there was already a saved item, it is overwritten
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("portfolios", JSON.stringify(this.portfolios));
		}else{
			console.log("No support for local storage");
		}

		console.log(this.portfolios);
		// Redirect to the home page
		this.props.history.push("/");
	}

	// Focus on the name field when component is mounted
	componentDidMount() {
		this.refs.name.focus();
	}

	render() {
		// Get the stored portfolios if there is any
		if (typeof(Storage) !== "undefined" && localStorage.length !== 0) {
			this.storedPortfolios = JSON.parse(localStorage.getItem("portfolios"));
			this.portfolios = this.storedPortfolios;
		}
		
		return (
			// Simple form with name input and save button
			<div>
				<form className="form-group" ref="newPortfolioForm">
					<label htmlFor="name">Portfolio name</label>
					<input ref="name" type="text" className="form-control" />
					<button onClick={(e)=>this.save(e)} className="btn btn-primary w-100 mt-3">Save</button>
				</form>
			</div>
		);
	}
}

