import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class NavBar extends Component {

  // Navigation bar at the top, uses a basic bootstrap navbar
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          {/* Link to the home page */}
          <NavLink className="navbar-brand" to="/">SPMS</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              {/* Link to the new portfolio page */}
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/new">New portfolio</NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

