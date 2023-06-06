import * as Task from './components/Task/Task';
import * as Header from './components/Header/Header';
import * as Modal from './components/Modal/Modal';
import * as Utils from './utils';
import * as Interfaces from './interfaces'
import '../main.css'

(function () {
    

    let state: Interfaces.Task[] = undefined;
    let IDCount: number = 0;

    /**
     * Global application state
     * @template T
     * @param {T} initialValue
     * @returns {[T, function(T): void]}
     */
    function useState(initialValue: Interfaces.Task[]): [Interfaces.Task[], (newValue: Interfaces.Task[]) => void] {
        state = state || initialValue;
        function setValue(newValue: Interfaces.Task[]): void {
            state = newValue;
            renderApp();
        }

        return [state, setValue];
    }


async function fetchTasksFromServer() : Promise<Interfaces.Task[]>{
    const response = await fetch('http://localhost:3004/tasks');
    const data: Interfaces.Task[] = await response.json();
    return data;
}
async function fetchIDCounter(): Promise<number> {
    try {
        const response = await fetch('http://localhost:3004/counter');
        const data: Interfaces.Counter = await response.json();
        return data.count;
    } catch (error: any) {
        console.error("Error fetching ID counter:", error);
        document.getElementById("root").append(Utils.Heading({ text: "Sorry! We are experiencing a server error", type: 1 }));
        return -1;
    }

}
/**
 * App Utils.container
 * @returns {HTMLDivElement} - The app Utils.container
 */
    function App(): HTMLElement {
    const div = document.createElement("div");

    async function initilize(): Promise<void> {
        IDCount = await fetchIDCounter();
        console.log(IDCount);
        if (IDCount === -1) {
            IDCount = (new Date()).getMilliseconds();
            // emergency measure
        }
        
        const fetchedTasks = await fetchTasksFromServer();
        const [tasks, setTasks] = useState(fetchedTasks || []);
        
        Task.importTasks(tasks, IDCount, setTasks, renderApp);
        const addTaskModal = Modal.constructModal(Task.addCurrentTask);
        let completedTasks = tasks.filter((task) => task.isCompleted);
        let currentTasks = tasks.filter((task) => !task.isCompleted);

        const main = document.createElement("main");
        div.append(Header.constructHeader(addTaskModal), main);
        main.append(Utils.Heading({ text: "Current Tasks", type: 2 }));
        if (currentTasks.length > 0) {
            const currentTasksList = Utils.Container({ classNames: [] });
            currentTasks.forEach((currentTask) => {
                currentTasksList.append(Task.CurrentTask(currentTask, Task.removeCurrentTask, Task.transferCurrentTask));
            });
            main.append(currentTasksList);
        } else {
            main.append(Utils.Paragraph({ text: "No current tasks" }));
        }


        main.append(Utils.Heading({ text: "Completed Tasks", type: 2 }));

        if (completedTasks.length > 0) {
            const completedTasksList = Utils.Container({ classNames: [] });
            completedTasks.forEach((completedTask) => {
                completedTasksList.append(Task.CompletedTask(completedTask));
            });
            main.append(completedTasksList);
        } else {
            main.append(Utils.Paragraph({ text: "No completed tasks" }));
        }
    }

    initilize();

    return div;
}

/**
 * Render the app.
 * On change whole app is re-rendered.
 */
function renderApp(): void {
    const appContainer = document.getElementById("root");
    appContainer.innerHTML = "";
    appContainer.append(App());
}

// initial render
renderApp();
}) ();