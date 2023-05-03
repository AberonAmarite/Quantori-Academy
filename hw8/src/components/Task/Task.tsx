import './Task.css';
import * as Utils from '../../utils';
import * as Interfaces from '../../interfaces'
import React from "react";
import { IDCount } from '../../App';

let tasks: Interfaces.Task[];

let setTasks: (newValue: Interfaces.Task[]) => void;


export function importTasks(tasksImported: Interfaces.Task[], setTasksImported: (newValue: Interfaces.Task[]) => void) {
    console.log(1);
    tasks = tasksImported;
    console.log('tasksImported: ', tasksImported);
    setTasks = setTasksImported;
}

function Task(task: Interfaces.Task, trashBtnCallback?: (currentTask: Interfaces.Task) => Promise<void>, transferCurrentTask?: (currentTask: Interfaces.Task) => Promise<void>) {
    let taskType = "completed";
    let checkboxCallback = () => { };
    if (trashBtnCallback) {
        taskType = "current";
        checkboxCallback = () => transferCurrentTask(task);
    }

    const today = new Date();
    const dlAsDate = new Date(task.deadline);

    let todayArr = Utils.extractDayAndName(today);
    let dlArr =  Utils.extractDayAndName(dlAsDate);
    let todayArr1 =  Utils.extractDateWithZeroes(today);
    let dlArr1 =  Utils.extractDateWithZeroes(dlAsDate);
    let displayedDeadline;

    if (todayArr1[1] == dlArr1[1] && todayArr1[2] == dlArr1[2]) {
        if (todayArr[1] == dlArr[1]) {
            displayedDeadline = "Today";
        } else if (todayArr[1] + 1 == (dlArr[1])) {
            displayedDeadline = "Tomorrow";
        } else {
            displayedDeadline = `${ Utils.numberToDay(dlArr[0])}, ${dlArr[1]} ${ Utils.numberToMonth(dlArr[2])}`;
        }
    } else {
        displayedDeadline = `${ Utils.numberToDay(dlArr[0])}, ${dlArr[1]} ${ Utils.numberToMonth(dlArr[2])}`;
    }

    return (
        <div className={'row ' + taskType} key={task.id}>
            <button className={taskType + "__checkbox"} onClick={() => {
                if (trashBtnCallback) transferCurrentTask(task);
            }}></button>
            <div className={'column ' + taskType + "__main-text"}>
                <h3 className={taskType + "__title"}>{task.title}</h3>
                <div className='row'>
                    <div className={"tag tag-" + task.tag}>{task.tag}</div>
                    <div className={taskType+"__deadline"}>{displayedDeadline}</div>
                </div>
            </div>
            {trashBtnCallback ? <button className='current__delete'  onClick={() => {trashBtnCallback(task)}}></button> : <></>}
        </div>
    );
}

export function CurrentTask(task: Interfaces.Task) {

    return Task(task, removeCurrentTask, transferCurrentTask);
}
export function CompletedTask(task: Interfaces.Task) {

    return Task(task, null, null);
}

export async function removeCurrentTask(currentTask: Interfaces.Task): Promise<void> {
    const newTasks = tasks.filter((task) => task !== currentTask);
    setTasks(newTasks);
    await fetch('http://localhost:3004/tasks/' + currentTask.id, {
        method: 'DELETE'
    })
    window.location.reload();
}

export async function transferCurrentTask(currentTask: Interfaces.Task): Promise<void> {
    console.log('tasks: ', tasks);
    const newTasks = tasks.map((task) => {
        
        if (task === currentTask) task.isCompleted = true;
    });
    setTasks(newTasks);
 
    await fetch('http://localhost:3004/tasks/' + currentTask.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentTask)
    })
    window.location.reload();
}

export function addCurrentTask(id: number, title: string, deadline: Date, tag: string): void {
    const task: Interfaces.Task = {id: id, title: title, deadline: deadline, tag: tag, isCompleted: false };
    
    async function postTask(): Promise<void> {
        
        await fetch('http://localhost:3004/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "id": id, "title": title, "deadline": deadline, "tag": tag, "isCompleted": false })
        }).then((response: Response) => {
            
            fetch('http://localhost:3004/counter', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "count": IDCount +1 })
            }).then(() => {
                setTasks([...tasks, task]);
                window.location.reload();
            })
        }
            );
    }
    postTask();
   
}