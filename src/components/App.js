import React, { Component } from 'react';
import { Route, HashRouter } from 'react-router-dom';

import Home from "./Home";
import Create from "./Create";
import Portfolio from "./Portfolio";
import NavBar from "./NavBar";
import Stock from "./Stock";

export default class App extends Component {

  render() {
    return (
      /* HashRouter contains the area where all the navigation happens */
      <HashRouter>
        <div>
          {/* The navigation bar */}
          <NavBar />
          <div className="content">
            {/* Specify different url routes and bind them with components */}
            <Route exact path="/" component={Home}/>
            <Route path="/new" component={Create}/>
            <Route exact path="/portfolio/:id" component={Portfolio}/>
            <Route path="/portfolio/:id/stock/:stock_id" component={Stock}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

