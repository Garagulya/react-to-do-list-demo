import React, { Component } from 'react';
import './App.css';
import Tasks from './Tasks';

class App extends Component {
    render() {
        return (
            <div className="app">
                <div className="appWrapper">
                    <h1 className="appTitle">Task Manager</h1>
                    <Tasks />
                </div>
            </div>
        );
    }
}

export default App;
