import React, { Component } from 'react';
import './App.css';
import Tasks from './Tasks';

class App extends Component {
    render() {
        return (
            <div className="app">
                <div className="appWrapper">
                    <h1 className="appTitle">To do list</h1>
                    <Tasks />
                </div>
            </div>
        );
    }
}

export default App;
