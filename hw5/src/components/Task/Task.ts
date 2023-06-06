import './Task.css';
import * as Utils from '../../utils';
import * as Modal from '../Modal/Modal';
import * as Interfaces from '../../interfaces'

let tasks: Interfaces.Task[];
export let IDCount: number;
let setTasks: (newValue: Interfaces.Task[]) => void;
let renderApp: () => void;

export function importTasks(tasksImported: Interfaces.Task[], IDCountImported: number, setTasksImported: (newValue: Interfaces.Task[]) => void, renderAppImported: () => void) {
    tasks = tasksImported;
    IDCount = IDCountImported;
    setTasks = setTasksImported;
    renderApp = renderAppImported;
}

function Task(task: Interfaces.Task, trashBtnCallback?: (currentTask: Interfaces.Task) => Promise<void>, transferCurrentTask?: (currentTask: Interfaces.Task) => Promise<void>) {
    let taskType = "completed";
    let checkboxCallback = () => { };
    if (trashBtnCallback) {
        taskType = "current";
        checkboxCallback = () => transferCurrentTask(task);
    }
    const container = Utils.Container({ classNames: ["row", taskType] });

    const checkbox = Utils.Button({
        text: "", onClick: checkboxCallback
    });
    checkbox.className = `${taskType}__checkbox`;
    const mainText = Utils.Container({ classNames: ["column", `${taskType}__main-text`] });
    const titleElem = Utils.Heading({ text: task.title, type: 3 });
    titleElem.className = `${taskType}__title`;
    const bottomElems = Utils.Container({ classNames: ["row"] });
    const tagContainer = Utils.Container({ classNames: [] });
    const tagElem = Utils.Container({ classNames: ["tag", `tag-${task.tag}`] });
    tagElem.innerHTML = task.tag;
    tagContainer.append(tagElem);
    const deadlineElem = Utils.Container({ classNames: [`${taskType}__deadline`] });

    const today = new Date();
    const dlAsDate = new Date(task.deadline);

    let todayArr = Utils.extractDayAndName(today);
    let dlArr =  Utils.extractDayAndName(dlAsDate);
    let todayArr1 =  Utils.extractDateWithZeroes(today);
    let dlArr1 =  Utils.extractDateWithZeroes(dlAsDate);

    if (todayArr1[1] == dlArr1[1] && todayArr1[2] == dlArr1[2]) {
        if (todayArr[1] == dlArr[1]) {
            deadlineElem.innerHTML = "Today";
        } else if (todayArr[1] + 1 == (dlArr[1])) {
            deadlineElem.innerHTML = "Tomorrow";
        } else {
            deadlineElem.innerHTML = `${ Utils.numberToDay(dlArr[0])}, ${dlArr[1]} ${ Utils.numberToMonth(dlArr[2])}`;
        }
    } else {
        deadlineElem.innerHTML = `${ Utils.numberToDay(dlArr[0])}, ${dlArr[1]} ${ Utils.numberToMonth(dlArr[2])}`;
    }

    bottomElems.append(tagContainer, deadlineElem);
    mainText.append(titleElem, bottomElems);
    container.append(checkbox, mainText);
    if (taskType === "current") {
        const trashBtn = Utils.Button({
            text: "", onClick: () => {
                trashBtnCallback(task);
            }
        });
        trashBtn.className = "current__delete";
        container.append(trashBtn);
    }
    return container;
}

export function CurrentTask(task: Interfaces.Task, trashBtnCallback: (currentTask: Interfaces.Task)=> Promise<void>, transferCurrentTask: (currentTask: Interfaces.Task) => Promise<void>) {
    return Task(task, trashBtnCallback, transferCurrentTask);
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
}

export async function transferCurrentTask(currentTask: Interfaces.Task): Promise<void> {
    tasks.forEach((task) => {
        if (task === currentTask) task.isCompleted = true;
    });
    renderApp();
 
    await fetch('http://localhost:3004/tasks/' + currentTask.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentTask)
    })
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
                body: JSON.stringify({ "count": id+1 })
            }).then(() => {
                setTasks([...tasks, task]);
            })
        }
            );
    }
    postTask();
    
}