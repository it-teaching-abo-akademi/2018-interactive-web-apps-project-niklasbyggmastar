import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Home extends Component {

	// Needed for global variables
	constructor(props) {
		super(props);
		this.portfolios = [];
	}

	// Create new portfolio button calls this. Takes the user to the new portfolio form
	createPortfolio = () => {
		this.props.history.push("/new");
	}

	render() {
		// Get stored portfolios if there are any
		if (typeof (Storage) !== "undefined" && localStorage.length !== 0) {
			this.portfolios = JSON.parse(localStorage.getItem("portfolios"));
		}
		let portfolios = this.portfolios;
		console.log(portfolios);
		return (
			<div>
					{/* If there are any portfolios */}
					{ portfolios.length > 0 &&
						<div>
							<h3 className="mb-4">My portfolios</h3>
							<div className="mb-5">
								{/* Iterate through the portfolios array and show each item with their name */}
								{ portfolios.map((portfolio, i) =>
									// Link to the specific portfolio details page
									<NavLink to={"/portfolio/" + i} className="list-item" key={i}>
										<span className="float-left">{portfolio.name}</span>
										<i className="fas fa-chevron-right"></i>
									</NavLink>			
								)}
							</div>
						</div>
					}
					{/* If there are no portfolios, show message and a create button */}
					{ portfolios.length === 0 &&
						<div>
							<h4>You don't have any portfolios yet</h4>
							<button onClick={()=>this.createPortfolio()} type="button" className="btn btn-success">Create one</button>
						</div>
					}
			</div>
		);
	}
}

