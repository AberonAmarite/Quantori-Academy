import * as Task from './components/Task/Task.js';
import * as Header from './components/Header/Header.js';
import * as Modal from './components/Modal/Modal.js';
import * as Utils from './utils.js';
import '../main.css'

(function () {
    
    

    let state = undefined;
    let IDCount = 0;


    /**
     * Global application state
     * @template T
     * @param {T} initialValue
     * @returns {[T, function(T): void]}
     */
    function useState(initialValue) {
        state = state || initialValue;
        function setValue(newValue) {
            state = newValue;
            renderApp();
        }

        return [state, setValue];
    }


async function fetchTasksFromServer() {
    const response = await fetch('http://localhost:3004/tasks');
    const data = await response.json();
    return data;
}
async function fetchIDCounter() {
    try {
        const response = await fetch('http://localhost:3004/counter');
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error("Error fetching ID counter:", error);
        document.getElementById("root").append(Utils.Heading({ text: "Sorry! We are experiencing a server error", type: 1 }));
    }

}
/**
 * App Utils.container
 * @returns {HTMLDivElement} - The app Utils.container
 */
    function App() {
    const div = document.createElement("div");

    async function initilize() {
        IDCount = await fetchIDCounter();
       
       
       
        const fetchedTasks = await fetchTasksFromServer();
        const [tasks, setTasks] = useState(fetchedTasks || []);
        if (IDCount == null) {
            IDCount = (new Date()).getMilliseconds();
            // emergency measure
        }
        Task.importTasks(tasks, IDCount, setTasks, renderApp);
        const addTaskModal = Modal.constructModal(Task.addCurrentTask);
        let completedTasks = tasks.filter((task) => task.isCompleted);
        let currentTasks = tasks.filter((task) => !task.isCompleted);

        const main = document.createElement("main", { classNames: ["main"] });
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
function renderApp() {
    const appContainer = document.getElementById("root");
    appContainer.innerHTML = "";
    appContainer.append(App());
}

// initial render
renderApp();
}) ();