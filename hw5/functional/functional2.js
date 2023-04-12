(function () {
    let state = undefined;
    const tagNames = ["health", "home", "work", "other"];
    let addTaskModal = constructModal();

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
    function Button( text, onClick ) {
        const button = document.createElement("button");
        button.innerHTML = text;
        button.onclick = onClick;
        return button;
    }

    function Paragraph(text) {
        const paragraph = document.createElement("p");
        paragraph.innerHTML = text;
        return paragraph;
    }
    function Heading(text, type) {
        if (type > 0 && type < 7) {
            let tag = "h" + type;
            const paragraph = document.createElement(tag);
            paragraph.innerHTML = text;
            return paragraph;
        }
    }

    function SearchInput() {
        const search = document.createElement("input");
        search.type = "search";
        return search;
    }

    function Header() {
        const header = document.createElement("header");
        header.classList.add("header")
        return header;
    }
    function constructHeader() {
        const header = Header();

        const h1 = Heading("To Do List", 1);
        header.append(h1);
        header.append(SearchInput());
        hideModal(addTaskModal);
        header.append(Button(  "New Task", () => { showModal(addTaskModal);  }));
        return header;
    }
    function addTask(title, deadline, tag) {
        currentTasks.push({
            title: title,
            deadline: deadline,
            tag: tag
        });
    }
    function constructTaskListItem(task) {
        let item = document.createElement("div");
        item.classList.add("completed-tasks__item");
        item.append(
            Heading(task.title, 3),
            Paragraph(task.tag),
            Paragraph(task.deadline)
        )
        return item;
    }
    function constructTasks(sectionTitle, taskList) {
        let tasks = document.createElement("div");
        tasks.append(Heading(sectionTitle, 2));
        for (const task of taskList) {
            tasks.append(constructTaskListItem(task));
        }
        return tasks;
    }
    function constructTasksCurrent() {
        return constructTasks("All Tasks", currentTasks);
    }
    function constructTasksCompleted() {

    }
    function constructModal () {
        // Create the modal
        var modal = document.createElement("div");
        modal.id = "myModal";
        modal.className = "modal";

        // Create the modal content
        var modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Create the title
        var title = document.createElement("h2");
        title.innerHTML = "Add Task";
        modalContent.appendChild(title);

        // Create the form
        var form = document.createElement("form");

        // Create the task name input field
        var taskNameLabel = document.createElement("label");
        taskNameLabel.innerHTML = "Task Name:";
        form.appendChild(taskNameLabel);
        var taskNameInput = document.createElement("input");
        taskNameInput.type = "text";
        taskNameInput.id = "taskName";
        taskNameInput.name = "taskName";
        form.appendChild(taskNameInput);

        // Create the deadline date input field
        var deadlineDateLabel = document.createElement("label");
        deadlineDateLabel.innerHTML = "Deadline Date:";
        form.appendChild(deadlineDateLabel);
        var deadlineDateInput = document.createElement("input");
        deadlineDateInput.type = "date";
        deadlineDateInput.id = "deadlineDate";
        deadlineDateInput.name = "deadlineDate";
        form.appendChild(deadlineDateInput);

        // Create the tags buttons
        var tagsLabel = document.createElement("label");
        tagsLabel.innerHTML = "Tags:";
        form.appendChild(tagsLabel);

        var tagsContainer = document.createElement("div");
        tagsContainer.className = "tag-container";
        let selectedTag = "default";

        for (let i = 0; i < tagNames.length; i++) {
            let tagButton = Button(
                tagNames[i],
                (event) => {
                    console.log(tagNames[i]);
                    event.preventDefault();
                selectedTag = tagNames[i];
            });
            tagButton.className = "tag-button";
            tagButton.id = tagNames[i];
            tagsContainer.appendChild(tagButton);
        }

        form.appendChild(tagsContainer);

        // Create the Add Task and Cancel buttons
        var addTaskButton = Button( "Add Task", () => {
            addCurrentTask(taskName.value, deadlineDate.value, selectedTag);
            console.log("Task Name:", taskName.value);
            console.log("Deadline Date:", deadlineDate.value);
            console.log("Tag:", selectedTag);
        });
        addTaskButton.type = "button";
        addTaskButton.id = "addTask";
        form.appendChild(addTaskButton);

        var cancelButton = Button("Cancel", () => {
            hideModal(addTaskModal);
        });
        cancelButton.type = "button";
        cancelButton.id = "cancel";
        form.appendChild(cancelButton);

        modalContent.appendChild(form);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);


        return modal;
    }
    function showModal(modal) {
        modal.style.visibility = "visible";
    }
    function hideModal(modal) {
        modal.style.visibility = "hidden";
    }

    /**
     * App container
     * @returns {HTMLDivElement} - The app container
     */
    function App() {
        console.log(Date.now());
        const div = document.createElement("div");
        /*
               const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);

        function addItem() {
            setItems([...items, `Item ${items.length + 1}`]);
        }

   
        const list = List({items});
        const button = Button({text: "Add item", onClick: addItem});
        div.append(list, button);
        */
        const [currentTasks, setCurrentTasks] = useState([]);
        function addCurrentTask(title, deadline, tag) {
            setCurrentTasks([...currentTasks, {
                title: title,
                deadline: deadline,
                tag: tag
            }]);
        }
        const header = constructHeader();
     
        div.append(header);
        div.append(constructTasksCurrent());
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