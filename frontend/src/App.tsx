import React from "react";
import './App.scss';
import RoutingHOC from "./components/RoutingHOC/RoutingHOC";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

const App = () => {
  // Use react-router, route all traffic to RoutingHOC for control over useLocation hook
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route>
            <RoutingHOC />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
