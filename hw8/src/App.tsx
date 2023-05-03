import React, { useState, useEffect } from 'react';
import * as Task from './components/Task/Task';
import * as Interfaces from './interfaces'

import { Header } from './components/Header/Header';
import {Modal} from './components/Modal/Modal';

export let IDCount = 0;

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
  
      document.getElementById("root").innerHTML = "Sorry! We are experiencing a server error";
      return -1;
  }

}

const App = () => {

  const modal = Modal(Task.addCurrentTask);

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentTasks, setCurrentTasks] = useState([]);

  async function initialize() {
    IDCount = await fetchIDCounter();
    if (IDCount === -1) {
      IDCount = new Date().getMilliseconds();
      // emergency measure
    }

    const fetchedTasks = await fetchTasksFromServer();
    console.log('fetchedTasks: ', fetchedTasks);
    setTasks(fetchedTasks || []);

    Task.importTasks(fetchedTasks, setTasks);

    setCurrentTasks(fetchedTasks.filter((task) => !task.isCompleted));
    setCompletedTasks(fetchedTasks.filter((task) => task.isCompleted));
  }

  useEffect(() => {
    initialize();
  }, []);

  
  return (
    <>
      <Header addTaskModal={modal} />
      {modal}
      <main>
        <h2>Current Tasks</h2>
        <div>
          {currentTasks.map((currentTask) =>
           Task.CurrentTask(currentTask)
          )}
        </div>
        <h2>Completed Tasks</h2>
        <div>{completedTasks.map(ct =>
          Task.CompletedTask(ct)
            )}
          </div>
      </main>
    </>
  );
};

export default App;