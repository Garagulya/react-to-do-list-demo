import React, { PureComponent } from 'react';
import moment from 'moment';

import TaskInput from './TaskInput';
import './Tasks.css';
import { MINUTE_IN_MILLISECONDS } from "./constants";

export class Tasks extends PureComponent {
    state = {
        activeTasks: [],
        completedTasks: [],
    };

    componentDidMount() {
        this.setState({activeTasks: JSON.parse(localStorage.getItem('activeTasks')) || []});
        if (typeof window !== 'undefined') {
            window.addEventListener('pagehide', this.saveTasksToLocalStorage);
        }
    }

    componentWillUnmount() {
        this.saveTasksToLocalStorage();
        if (typeof window !== 'undefined') {
            window.removeEventListener('pagehide', this.saveTasksToLocalStorage);
        }
    }

    saveTasksToLocalStorage = () => {
        localStorage.setItem('activeTasks', JSON.stringify(this.state.activeTasks));
    };

    addNewTask = (taskText) => {
        const newTask = {
            id: moment().format('x'), // unix timestamp in milliseconds (now)
            activationDate: moment(), // date (now)
            name: taskText
        };
        this.setState(prevState => ({
            activeTasks: [...prevState.activeTasks, newTask]
        }));
    };

    completeTask = (task) => () => {
        const filteredActiveTasks = this.filterTasks(this.state.activeTasks, task.id);
        const taskWithCompletionTime = Object.assign(task, {completionTime: moment().format('x')});
        this.setState(prevState => ({
            activeTasks: filteredActiveTasks,
            completedTasks: [...prevState.completedTasks, taskWithCompletionTime]
        }));
        setTimeout(this.deleteCompletedTask(task.id), MINUTE_IN_MILLISECONDS);
    };

    deleteCompletedTask = (taskIdToDelete) => () => {
        const {completedTasks} = this.state;
        const taskToDelete = completedTasks.find(task => task.id === taskIdToDelete);
        if (taskToDelete) {
            const timePassedSinceCompletion = moment().format('x') - taskToDelete.completionTime;
            if (timePassedSinceCompletion >= MINUTE_IN_MILLISECONDS) {
                const filteredCompletedTasks = this.filterTasks(completedTasks, taskIdToDelete);
                this.setState({completedTasks: filteredCompletedTasks});
            }
        }
    };

    activateTask = (task) => () => {
        const filteredCompletedTasks = this.filterTasks(this.state.completedTasks, task.id);
        this.setState(prevState => ({
            activeTasks: [...prevState.activeTasks, task],
            completedTasks: filteredCompletedTasks
        }));
    };

    filterTasks = (tasks, taskIdToFilter) => {
        return tasks.filter(task => task.id !== taskIdToFilter);
    };

    render() {
        const {taskText, activeTasks, completedTasks} = this.state;
        return (
            <div className="panelWrapper">
                <h1 className="panelTitle">Tasks</h1>
                <TaskInput taskText={taskText} addNewTask={this.addNewTask} handleInputChange={this.handleInputChange} />
                <div className="activeTasksWrapper">
                    {activeTasks.map((task) => {
                        const activationDate = moment(task.activationDate).format('MMM D, YYYY');
                        return <div key={task.id} className="taskListItem" onClick={this.completeTask(task)}>
                            <div className="taskText"><span>{task.name}</span></div>
                            <div className="activationDate">{activationDate}</div>
                        </div>;
                    })}
                </div>
                <div className="completedTasksWrapper">
                    {completedTasks.map((task) =>
                        <div key={task.id} className="taskListItem completed" onClick={this.activateTask(task)}>
                            <div className="taskText"><span>{task.name}</span></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Tasks;
