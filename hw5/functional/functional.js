(function () {
    let state = undefined;
    const tagNames = ["health", "work", "home", "other"];
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
            let modal = document.createElement("div");
            modal.id = "modal";
            modal.className = "modal";

            // Create the modal content
            let modalContent = document.createElement("div");
            modalContent.className = "modal-content";

            // Create the title
            let title = document.createElement("h2");
            title.innerHTML = "Add Task";
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
            let tagsContainer = document.createElement("div");
            tagsContainer.className = "modal__tags";
            let selectedTagName = "tag";

            for (let i = 0; i < tagNames.length; i++) {
                let tagButton = Button({
                    text: tagNames[i],
                    onClick: (event) => {
                        event.preventDefault();
                        selectedTagName = tagNames[i];
                        const color = window.getComputedStyle(tagButton).getPropertyValue('color');
                        tagButton.style.border = `1px solid ${color}`;
                        for(element of tagsContainer.getElementsByClassName("modal__tag")){
                            if (element.innerHTML != selectedTagName) {
                                element.style.border = "1px solid white";
                            }
                        };
                    }
                });
                tagButton.classList.add("modal__tag", `modal__tag-${tagNames[i]}`);
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
            function extractDate(date) {
                let month =  date.getMonth() > 9 ? date.getMonth()+1 : "0" + (date.getMonth()+1);
                let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
                // [DD,MM,YYYY]
                return [day, month, date.getFullYear()];
            }
            const todayArray = extractDate(today);
            let currentDate = "" + `${todayArray[2]}-${todayArray[1]}-${todayArray[0]}`;
            deadlineDateInput.defaultValue = currentDate;

            const dateArray = extractDate(new Date(deadlineDateInput.value));
           

            let deadlineDateSubstituteStr =`${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`;
            let deadlineDateSubstitute = Button({ text: "", onClick: (event) => {
                deadlineDateInput.showPicker();
                event.preventDefault();
            } });
            deadlineDateSubstitute.className = "modal__deadline";
            const dateText = Paragraph({ text: deadlineDateSubstituteStr });
            deadlineDateSubstitute.append(dateText, deadlineDateInput);
            function changeDateSubsitute() {
                const dateArray = extractDate(new Date(deadlineDateInput.value));
                dateText.innerText = `${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`;
                
            }
            deadlineDateInput.onchange = changeDateSubsitute;
            const row1 = Container({classNames: ["row", "modal__row1"]}), row2 = Container({classNames: ["row", "modal__row2"]});
            row1.append(tagsContainer, deadlineDateSubstitute);
            form.append(row1);
            // Create the Add Task and Cancel buttons
            let addTaskButton = Button({
                text: "Add Task", onClick: () => {
                    addCurrentTask(taskNameInput.value, deadlineDateInput.value, selectedTag);
                    console.log("Task Name:", taskNameInput.value);
                    console.log("Deadline Date:", deadlineDateInput.value);
                    console.log("Tag:", selectedTag);
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
        const currentTasksFromStorage = JSON.parse(localStorage.getItem("currentTasks"));
        const [currentTasks, setCurrentTasks] = useState(currentTasksFromStorage);


        const main = document.createElement("main");
        main.classList.add("main");
        const currentTasksHeading = Heading({ text: "Current Tasks", type: 2 });
        main.appendChild(currentTasksHeading);

        if (currentTasks && currentTasks.length > 0) {
            const currentTasksList = List({ items: currentTasks.map((task) => task.title) });
            main.appendChild(currentTasksList);
        } else {
            const noCurrentTasksParagraph = Paragraph({ text: "No current tasks" });
            main.appendChild(noCurrentTasksParagraph);
        }
        div.append(main);
        function addCurrentTask(title, deadline, tag) {
            const task = { title: title, deadline: deadline, tag: tag };
            setCurrentTasks([...currentTasks, task]);
            localStorage.setItem("currentTasks", JSON.stringify([...currentTasks, task]));
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