import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import Calculations from './Calculations'

const FrontendRouter = () => (
    <Router>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Calculation</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/loggedOut">LogOut</Link>
                    </li>
                </ul>
            </nav>

            <Switch>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/loggedOut">
                    <LoggedOut />
                </Route>
                <Route path="/">
                    <Calculations />
                </Route>
            </Switch>
        </div>
    </Router>
);

const About = () => {
    return <h2>Pricing & Profitability Team</h2>;
}

const LoggedOut = () => {
    return <h2>Your are logged out</h2>;
}

export default FrontendRouter
