import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import asyncComponent from './Components/asyncComponent';
const Rate = asyncComponent(() => import("./pages/others/rate"));
const Check = asyncComponent(() => import("./pages/index"));
const Admin = asyncComponent(() => import("./pages/admin/admin"));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logisticCode: '',
            expressList: [],
            checking: false,
            modalOpen: false,
            modalTitle: '',
            modalContent: '',
            traces: [],
            todayCount: 0,
            historyCount: 0,
            useAnalysis: true,
            allExpress: []
        };
    };

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Check}/>
                    <Route exact path="/rate" component={Rate}/>
                    <Route exact path="/admin" component={Admin}/>
                </Switch>
            </Router>
        );
    }
}
export default App;
