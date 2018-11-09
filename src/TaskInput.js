import React, { PureComponent } from 'react';

import { ReactComponent as PlusIcon } from './add.svg';
import './TaskInput.css';
import {ENTER_KEY} from "./constants";

export class TaskInput extends PureComponent {
    state = {
        taskText: ''
    };

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('keyup', this.listenForEnter);
        }
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keyup', this.listenForEnter);
        }
    }

    listenForEnter = (event) => {
        if (event.key === ENTER_KEY && this.state.taskText) {
            this.addNewTask();
        }
    };

    addNewTask = () => {
        this.props.addNewTask(this.state.taskText);
        this.setState({taskText: ''});
    };

    handleInputChange = (e) => {
        this.setState({taskText: e.target.value});
    };

    render() {
        const {taskText} = this.state;
        return (
            <div className="taskInputWrapper">
                <PlusIcon className="plusSign" />
                <input
                    type="text"
                    className="taskInput"
                    placeholder="Add new task"
                    value={taskText}
                    onChange={this.handleInputChange}
                />
                <div className={`addBtn${taskText && ' active'}`} onClick={this.addNewTask}>
                    Add
                </div>
                <div className="blueBottomBorder" />
            </div>
        );
    }
}

export default TaskInput;
