import * as Utils from '../../utils';
import * as Task from '../Task/Task'
import * as Interfaces from '../../interfaces';
import './Modal.css';
const tagNames = ["health", "work", "home", "other"];

export function constructModal(addCurrentTask: (id: number, title: string, deadline: Date, tag: string) =>void ) {
    // Create the modal
    let modal = Utils.Container({ classNames: ["modal"] });

    // Create the modal content
    let modalContent = Utils.Container({ classNames: ["modal-content"] });

    // Create the title
    let title = Utils.Heading({ text: "Add Task", type: 2 })
    modalContent.appendChild(title);

    // Create the form
    let form = document.createElement("form");

    let taskNameInput = Utils.SearchInput("Task Title");
    taskNameInput.type = "text";
    taskNameInput.id = "taskName";
    taskNameInput.classList.add("search-input");
    taskNameInput.classList.add("modal__task-title");
    form.appendChild(taskNameInput);

    // Create the tags buttons
    let tagsContainer = Utils.Container({ classNames: ["modal__tags"] });
    let selectedTagName = "tag";

    for (let i = 0; i < tagNames.length; i++) {
        let tagButton = Utils.Button({
            text: tagNames[i],
            onClick: (event: MouseEvent) => {
                event.preventDefault();
                selectedTagName = tagNames[i];
                const color = window.getComputedStyle(tagButton).getPropertyValue('color');
                tagButton.style.border = `1px solid ${color}`;
                const elements = Array.from(tagsContainer.getElementsByClassName("tag"));
                elements.forEach((element: HTMLElement) => {
                    if (element.innerHTML != selectedTagName) {
                        element.style.border = "1px solid white";
                    }
                });
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

    const todayArray = Utils.extractDateWithZeroes(today);
    let currentDate = "" + `${todayArray[2]}-${todayArray[1]}-${todayArray[0]}`;
    deadlineDateInput.defaultValue = currentDate;

    const dateArray = Utils.extractDateWithZeroes(new Date(deadlineDateInput.value));


    let deadlineDateSubstituteStr = `${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`;
    let deadlineDateSubstitute =Utils.Button({
        text: "", onClick: (event: MouseEvent) => {
            deadlineDateInput.showPicker();
            event.preventDefault();
        }
    });
    deadlineDateSubstitute.className = "modal__deadline";
    const dateText = Utils.Paragraph({ text: deadlineDateSubstituteStr });
    deadlineDateSubstitute.append(dateText, deadlineDateInput);
    function changeDateSubsitute() {
        const dateArray = Utils.extractDateWithZeroes(new Date(deadlineDateInput.value));
        dateText.innerText = `${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`;

    }
    deadlineDateInput.onchange = changeDateSubsitute;
    const row1 = Utils.Container({ classNames: ["row", "modal__row1"] }), row2 = Utils.Container({ classNames: ["row", "modal__row2"] });
    row1.append(tagsContainer, deadlineDateSubstitute);
    form.append(row1);
    // Create the Add Task and Cancel buttons
    let addTaskButton =Utils.Button({
        text: "Add Task", onClick: () => {
            Task.addCurrentTask(Task.IDCount, taskNameInput.value, new Date(deadlineDateInput.value), selectedTagName);
            hideModal(modal);
        }
    });
    addTaskButton.type = "button";
    addTaskButton.id = "addTask";
    addTaskButton.classList.add("modal__add-task");

    let cancelButton =Utils.Button({
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
    hideModal(modal);
    return modal;
}

export function showModal(modal: HTMLElement) {
    modal.style.visibility = "visible";
}

export function hideModal(modal: HTMLElement) {
    modal.style.visibility = "hidden";
}

