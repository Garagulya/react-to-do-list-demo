import React, { PureComponent } from 'react';
import moment from 'moment';

import { ReactComponent as PlusIcon } from './add.svg';
import './Tasks.css';
import { ENTER_KEY_CODE, MINUTE_IN_MILLISECONDS } from "./constants";

export class Tasks extends PureComponent {
    state = {
        taskText: '',
        activeTasks: JSON.parse(localStorage.getItem('activeTasks')) || [],
        completedTasks: [],
    };

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('keyup', this.listenForEnter);
        }
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keyup', this.listenForEnter, true);
        }
    }

    listenForEnter = (event) => {
        if (event.keyCode === ENTER_KEY_CODE && this.state.taskText) {
            this.addNewTask();
        }
    };

    handleInputChange = (e) => {
        this.setState({taskText: e.target.value});
    };

    addNewTask = () => {
        const {taskText, activeTasks} = this.state;
        const task = {
            id: moment().format('x'), // unix timestamp
            date: moment(),
            name: taskText
        };
        activeTasks.push(task);
        this.setState({taskText: '', activeTasks});
        localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
    };

    completeTask = (task) => () => {
        const {activeTasks, completedTasks} = this.state;
        completedTasks.push(task);
        const filteredActiveTasks = this.filterTasks(activeTasks, task.id);
        this.setState({activeTasks: filteredActiveTasks, completedTasks});
        setTimeout(this.deleteCompletedTask(task.id), MINUTE_IN_MILLISECONDS); //@todo нужно переделать с записью completionTime
        localStorage.setItem('activeTasks', JSON.stringify(filteredActiveTasks));
    };

    deleteCompletedTask = (taskIdToDelete) => () => {
        const {completedTasks} = this.state;
        const filteredCompletedTasks = this.filterTasks(completedTasks, taskIdToDelete);
        this.setState({completedTasks: filteredCompletedTasks});
    };

    activateTask = (task) => () => {
        const {activeTasks, completedTasks} = this.state; // проверить про slice
        activeTasks.push(task);
        const filteredCompletedTasks = this.filterTasks(completedTasks, task.id);
        this.setState({activeTasks, completedTasks: filteredCompletedTasks});
        localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
    };

    filterTasks = (tasks, taskIdToFilter) => {
        return tasks.filter(task => task.id !== taskIdToFilter);
    };

    render() {
        const {taskText, activeTasks, completedTasks} = this.state;
        return (
            <div className="panelWrapper">
                <h1 className="panelTitle">Work</h1>
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
                <div className="activeTasksWrapper">
                    {activeTasks.map((task) =>
                        <div key={task.id} className="taskListItem" onClick={this.completeTask(task)}>
                            {task.name}
                        </div>
                    )}
                </div>
                <div className="completedTasksWrapper">
                    {completedTasks.map((task) => {
                        const date = moment(task.date).format('MMM D, YYYY');
                        return <div key={task.id} className="taskListItem completed" onClick={this.activateTask(task)}>
                            <span>{task.name}</span>
                            <div className="completedDate">{date}</div>
                        </div>;
                    })}
                </div>
            </div>
        );
    }
}

export default Tasks;
