import * as Utils from '../../utils';
import * as Task from '../Task/Task'
import './Modal.css';
import React, { useState } from 'react';
import { IDCount } from '../../App';
const tagNames = ["health", "work", "home", "other"];

export function Modal(addCurrentTask: (id: number, title: string, deadline: Date, tag: string) => void) {

    let selectedTagName = "tag";
    const handleTagButtonClick = (event: any) => {
        event.preventDefault();
        let tagButton = event.target;
        let tagContainer = tagButton.parentElement;
        selectedTagName = tagButton.id;
        const color = window.getComputedStyle(tagButton).getPropertyValue('color');
        tagButton.style.border = `1px solid ${color}`;
        const elements = Array.from(tagContainer.getElementsByClassName("tag"));
        elements.forEach((element: HTMLElement) => {
            if (element.innerHTML != selectedTagName) {
                element.style.border = "1px solid white";
            }
        });
    }
    const tagButtons = tagNames
        .map((tag) => (<button className={'tag tag-' + tag} id={tag} onClick={handleTagButtonClick}>{tag}</button>));


    const today = new Date();
   
   
    const todayArray = Utils.extractDateWithZeroes(today);
    let currentDate = `${todayArray[0]}.${todayArray[1]}.${todayArray[2]}`;

    const [displayedDate, setDisplayedDate] = useState(currentDate);
    return (
        <div className='modal' style={{ visibility: "hidden" }}>
            <div className='modal-content'>
                <h2>Add Task</h2>
                <form>
                    <input type="text" placeholder='Task Title' name="" id="taskName" className='search-input modal__task-title' onInput={(event) => {
                        const addTaskBtn = document.getElementById("add-task");
                        if (event.target.value.length) {
                            addTaskBtn.classList.add("modal__add-task--complete");
                        } else {
                            addTaskBtn.classList.remove("modal__add-task--complete");
                        }
                    }} />
                    <div className='row modal__row1'>
                        <div className='modal__tags'>
                            {tagButtons}
                        </div>

                        <button className='modal__deadline'
                            onClick={(event) => {

                                document.getElementById("deadlineDate").showPicker();
                                event.preventDefault();

                            }}
                        >
                            <p>{displayedDate}</p>
                            <input type="date" id='deadlineDate' name='deadlineDate'
                                onChange={(event) => {
                                    const dateArray = Utils.extractDateWithZeroes(new Date(event.target.value));
                                    console.log('event.target: ', event.target);
                                    setDisplayedDate(`${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`);
                                }}
                                style={{
                                    visibility: "hidden",
                                    position: "absolute"
                                }}
                            />
                        </button>
                    </div>
                    <div className='row modal__row2'>
                        <button type='button' id='cancel' className='modal__cancel' onClick={
                            (event) => {

                                hideModal();
                            }

                        }>Cancel</button>
                        <button type='button' id='add-task' className='modal__add-task'
                            onClick={
                                (event) => {
                                    const deadlineDateInput = document.getElementById("deadlineDate");
                                    let taskName = document.getElementById("taskName").value;
                                    let addedDate = new Date();
                                    if(deadlineDateInput.value) addedDate = new Date(deadlineDateInput.value);
                                    Task.addCurrentTask(IDCount, taskName, addedDate, selectedTagName);

                                    hideModal();
                                }}
                        >Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function showModal() {
    let modal: HTMLElement = document.querySelector(".modal");
    modal.style.visibility = "visible";
}

export function hideModal() {
    let modal: HTMLElement = document.querySelector(".modal");
    modal.style.visibility = "hidden";
}

