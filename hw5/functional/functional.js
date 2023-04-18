(function () {
    let stateCurrent = undefined, stateCompleted = undefined;
    const tagNames = ["health", "work", "home", "other"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    /**
     * Global application state
     * @template T
     * @param {T} initialValue
     * @returns {[T, function(T): void]}
     */
    function useState(initialValue, state) {
        state = state || initialValue;
        function setValue(newValue) {
            state = newValue;
            renderApp();
        }

        return [state, setValue];
    }

    /**
     * Functional component for the list
     * @param items {string[]}
     * @returns {HTMLElement} - List element
     */
    function List({ items }) {
        const listItems = items.map((item) => `<li>${item}</li>`).join("");
        const ul = document.createElement("ul");
        ul.innerHTML = listItems;
        return ul;
    }

    /**
     * Button component
     * @param text {string}
     * @param onClick {function}
     * @returns {HTMLButtonElement} - Button element
     */
    function Button({ text, onClick }) {
        const button = document.createElement("button");
        button.innerHTML = text;
        button.onclick = onClick;
        return button;
    }
    function Container({classNames} ) {
        const div = document.createElement("div");
        div.classList.add(...classNames);
        return div;
    }
    function Paragraph({ text }) {
        const paragraph = document.createElement("p");
        paragraph.innerHTML = text;
        return paragraph;
    }
    function Heading({ text, type }) {
        if (type > 0 && type < 7) {
            let tag = "h" + type;
            const paragraph = document.createElement(tag);
            paragraph.innerHTML = text;
            return paragraph;
        }
    }

    function SearchInput(placeholder) {
        const search = document.createElement("input");
        search.type = "search";
        search.placeholder = placeholder;
        return search;
    }

    function Header() {
        const header = document.createElement("header");
        header.classList.add("header")
        return header;
    }
    function Checkbox(onClick) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.onclick = onClick;
        return checkbox;
    }
    function Task(task, trashBtnCallback, transferCurrentTask) {
        let taskType = "completed";
        let checkboxCallback = () => { };
        if (trashBtnCallback) {
            taskType = "current";
            checkboxCallback = () => transferCurrentTask(task);
        }
        const container = Container({ classNames: ["row", taskType] });
       
        const checkbox = Button({
            text: "", onClick: checkboxCallback
        } );
        checkbox.className = `${taskType}__checkbox`;
        const mainText = Container({ classNames: ["column", `${taskType}__main-text`] });
        const titleElem = Heading({ text: task.title, type: 3 });
        titleElem.className = `${taskType}__title`;
        const bottomElems = Container({ classNames: ["row"] });
        const tagContainer = Container({ classNames: [] });
        const tagElem = Container({ classNames: ["tag", `tag-${task.tag}`] });
        tagElem.innerHTML = task.tag;
        tagContainer.append(tagElem);
        const deadlineElem = Container({ classNames: [`${taskType}__deadline`] });
       
        const today = new Date();
        const dlAsDate = new Date(task.deadline);

        let todayArr = extractDayAndName(today);
        let dlArr = extractDayAndName(dlAsDate);
        let todayArr1 = extractDateWithZeroes(today);
        let dlArr1 = extractDateWithZeroes(dlAsDate);

        if (todayArr1[1] == dlArr1[1] && todayArr1[2] == dlArr1[2]) {
            if (todayArr[1] == dlArr[1]) {
                deadlineElem.innerHTML = "Today";
            } else if(todayArr[1]+1 == (dlArr[1])){
                deadlineElem.innerHTML = "Tomorrow";
            } else {
                deadlineElem.innerHTML = `${numberToDay(dlArr[0])}, ${dlArr[1]} ${numberToMonth(dlArr[2])}`;
            }
        } else {
            deadlineElem.innerHTML = `${numberToDay(dlArr[0])}, ${dlArr[1]} ${numberToMonth(dlArr[2])}`;
        }

        bottomElems.append(tagContainer, deadlineElem);
        mainText.append(titleElem, bottomElems);
        container.append(checkbox, mainText);
        if (taskType === "current") {
            const trashBtn = Button({
                text: "", onClick: () => {
                    trashBtnCallback(task);
                }
            });
            trashBtn.className = "current__delete";
            container.append(trashBtn);
        }
        return container;
    }

    function CurrentTask(task, trashBtnCallback, transferCurrentTask) {
        return Task(task, trashBtnCallback, transferCurrentTask);
    }   
    function CompletedTask(task) {
        return Task(task);
    }  
   

    function extractDayAndName(date) {
        let month =  date.getMonth();
        let dayName = date.getDay();
        let day = date.getDate();
        return [dayName, day, month];
    }
    function extractDateWithZeroes(date) {
        let month =  date.getMonth() > 9 ? date.getMonth()+1 : "0" + (date.getMonth()+1);
        let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        // [DD,MM,YYYY]
        return [day, month, date.getFullYear()];
    }
    function numberToMonth(num) {
        return months[num];
    }
    function numberToDay(num) {
        return dayNames[num];
    }
 

    /**
     * App container
     * @returns {HTMLDivElement} - The app container
     */
    function App() {
        const div = document.createElement("div");

        const addTaskModal = constructModal();
        hideModal(addTaskModal);

        const header = constructHeader(addTaskModal);
        div.append(header);
        function constructHeader(addTaskModal) {
            const header = Header();

            const h1 = Heading({ text: "To Do List", type: 1 });
            h1.classList.add("header__title");
            header.append(h1);
            const headerMain = Container({classNames: ["header__main"]});
            const search = SearchInput("Search Task");
            search.classList.add("search-input");
            function searchResults(tasks, searchValue, titleSelector) {
                for (let i = 0; i < tasks.length; i++) {
                    const taskTitle = tasks[i].querySelector(titleSelector).textContent.toLowerCase();
                    if (taskTitle.includes(searchValue)) {
                        tasks[i].classList.remove("display-none");
                    } else {
                        tasks[i].classList.add("display-none");
                    }
                }
            }
            search.oninput =() => {
                const searchValue = search.value.toLowerCase();
                const currentTasks = document.getElementsByClassName("current");
                const completedTasks = document.getElementsByClassName("completed");
                searchResults(currentTasks, searchValue, ".current__title");
                searchResults(completedTasks, searchValue, ".completed__title");

            }
            const newTaskBtn = Button({
                text: "+ New Task", onClick: () => {
                    showModal(addTaskModal);
                }
            });
            newTaskBtn.classList.add("header__new-task");
            headerMain.append(search, newTaskBtn);
            header.append(headerMain);
            return header;
        }

        function constructModal() {
            // Create the modal
            let modal = Container({ classNames: ["modal"] });

            // Create the modal content
            let modalContent = Container({ classNames: ["modal-content"] });

            // Create the title
            let title = Heading({text: "Add Task", type: 2})
            modalContent.appendChild(title);

            // Create the form
            let form = document.createElement("form");

            let taskNameInput = SearchInput("Task Title");
            taskNameInput.type = "text";
            taskNameInput.id = "taskName";
            taskNameInput.classList.add("search-input");
            taskNameInput.classList.add("modal__task-title");
            form.appendChild(taskNameInput);

            // Create the tags buttons
            let tagsContainer = Container({ classNames: ["modal__tags"] });
            let selectedTagName = "tag";

            for (let i = 0; i < tagNames.length; i++) {
                let tagButton = Button({
                    text: tagNames[i],
                    onClick: (event) => {
                        event.preventDefault();
                        selectedTagName = tagNames[i];
                        const color = window.getComputedStyle(tagButton).getPropertyValue('color');
                        tagButton.style.border = `1px solid ${color}`;
                        for(element of tagsContainer.getElementsByClassName("tag")){
                            if (element.innerHTML != selectedTagName) {
                                element.style.border = "1px solid white";
                            }
                        };
                    }
                });
                tagButton.classList.add("tag", `tag-${tagNames[i]}`);
                tagButton.id = tagNames[i];
                tagsContainer.appendChild(tagButton);
            }
            
            let deadlineDateInput = document.createElement("input");
            deadlineDateInput.type = "date";
            deadlineDateInput.id = "deadlineDate";
            deadlineDateInput.name = "deadlineDate";
            deadlineDateInput.style.visibility = "hidden";
            deadlineDateInput.style.position = "absolute";

            const today = new Date(); 
           
            const todayArray = extractDateWithZeroes(today);
            let currentDate = "" + `${todayArray[2]}-${todayArray[1]}-${todayArray[0]}`;
            deadlineDateInput.defaultValue = currentDate;

            const dateArray = extractDateWithZeroes(new Date(deadlineDateInput.value));
           

            let deadlineDateSubstituteStr =`${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`;
            let deadlineDateSubstitute = Button({ text: "", onClick: (event) => {
                deadlineDateInput.showPicker();
                event.preventDefault();
            } });
            deadlineDateSubstitute.className = "modal__deadline";
            const dateText = Paragraph({ text: deadlineDateSubstituteStr });
            deadlineDateSubstitute.append(dateText, deadlineDateInput);
            function changeDateSubsitute() {
                const dateArray = extractDateWithZeroes(new Date(deadlineDateInput.value));
                dateText.innerText = `${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`;
                
            }
            deadlineDateInput.onchange = changeDateSubsitute;
            const row1 = Container({classNames: ["row", "modal__row1"]}), row2 = Container({classNames: ["row", "modal__row2"]});
            row1.append(tagsContainer, deadlineDateSubstitute);
            form.append(row1);
            // Create the Add Task and Cancel buttons
            let addTaskButton = Button({
                text: "Add Task", onClick: () => {
                    addCurrentTask(taskNameInput.value, deadlineDateInput.value, selectedTagName);
                    
                }
            });
            addTaskButton.type = "button";
            addTaskButton.id = "addTask";
            addTaskButton.classList.add("modal__add-task");

            let cancelButton = Button({
                text: "Cancel", onClick: () => {
                    hideModal(modal);
                }
            });
            cancelButton.type = "button";
            cancelButton.id = "cancel";
            cancelButton.classList.add("modal__cancel");

            taskNameInput.oninput = () => {
                if (taskNameInput.value.length) {
                    addTaskButton.classList.add("modal__add-task--complete");
                } else {
                    addTaskButton.classList.remove("modal__add-task--complete");
                }
            }


            row2.append(cancelButton, addTaskButton);
            form.append(row2);
            modalContent.appendChild(form);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            return modal;
        }


        const currentTasksFromStorage = JSON.parse(localStorage.getItem("currentTasks")) || [];
        const [currentTasks, setCurrentTasks] = useState(currentTasksFromStorage, stateCurrent);
        const completedTasksFromStorage = JSON.parse(localStorage.getItem("completedTasks")) || [];
        
        const [completedTasks, setCompletedTasks] = useState(completedTasksFromStorage, stateCompleted); // completedTasks=currentTasks. Why?


        const main = document.createElement("main");
        main.classList.add("main");
        const currentTasksHeading = Heading({ text: "Current Tasks", type: 2 });
        main.appendChild(currentTasksHeading);

        function removeCurrentTask (currentTask){
            const newTasks = currentTasks.filter(el => el !== currentTask);
            
            localStorage.setItem("currentTasks", JSON.stringify(newTasks));
            setCurrentTasks(newTasks, stateCurrent);
        }
        function transferCurrentTask  (currentTask)  {
            addCompletedTask(currentTask.title, currentTask.deadline, currentTask.tag);
            removeCurrentTask(currentTask);
        }

        if (currentTasks && currentTasks.length > 0) {
            const currentTasksList = Container({ classNames: [] });
            for (currentTask of currentTasks) {
                currentTasksList.append(CurrentTask(currentTask, removeCurrentTask, transferCurrentTask));
            }
            main.appendChild(currentTasksList);
        } else {
            const noCurrentTasksParagraph = Paragraph({ text: "No current tasks" });
            main.appendChild(noCurrentTasksParagraph);
        }
        div.append(main);
        function addCurrentTask(title, deadline, tag) {
            const task = { title: title, deadline: deadline, tag: tag };
           
            localStorage.setItem("currentTasks", JSON.stringify([...currentTasks, task]));
            setCurrentTasks([...currentTasks, task], stateCurrent);
            hideModal(addTaskModal);
        }


        const completedTasksHeading = Heading({ text: "Completed Tasks", type: 2 });
        main.appendChild(completedTasksHeading);

        if (completedTasks && completedTasks.length > 0) {
            const completedTasksList = Container({ classNames: [] });
            for (completedTask of completedTasks) {
                
                completedTasksList.append(CompletedTask(completedTask));
            }
            main.appendChild(completedTasksList);
        } else {
            const noCompletedTasksParagraph = Paragraph({ text: "No completed tasks" });
            main.appendChild(noCompletedTasksParagraph);
        }
       
        function addCompletedTask(title, deadline, tag) {
            const task = { title: title, deadline: deadline, tag: tag };
            localStorage.setItem("completedTasks", JSON.stringify([...completedTasks, task]));
            setCompletedTasks([...completedTasks, task], stateCompleted);
        }

        function showModal(modal) {
            modal.style.visibility = "visible";
        }

        function hideModal(modal) {
            modal.style.visibility = "hidden";
        }



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
})();