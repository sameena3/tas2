import React from "react";
import { TaskProvider } from "./components/TodoContext";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { ToastContainer } from 'react-toastify';
import './styles/App.css';





function App() {
  
  return (
    <div className="main-container">
    <TaskProvider>
      <TaskInput />
      <TaskList  />
      <ToastContainer position="top-center" autoClose={10000} />


    </TaskProvider>
    </div>
  );
}

export default App;

