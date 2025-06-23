
import React, { useContext } from "react";
import { TaskContext } from "./TodoContext";  
import '../styles/_TaskInput.scss';


function TaskInput(){
      const { 
      inputvalue,
      setinputValue,
      remindertimer,
      setRemindertime,
      remindme,
      setremindme,
      handletask,
      
       } = useContext(TaskContext);


return(
<div className="container">
         <h1>Task Manager </h1>

    <input type="text"
    value={inputvalue}
    id="ph"
    onChange={(e)=>setinputValue(e.target.value)}
    placeholder="Enter ur task"
    />
    <label id="cbox">
    <input type="checkbox"
    checked={remindme}
        onChange={(e)=>setremindme(e.target.checked)}
        />
        Remind me  </label>
    <input type="datetime-local"
    value={remindertimer}
    id="dt"
    onChange={(e)=>setRemindertime(e.target.value)}
/>

<button onClick={handletask}>Add</button>
</div>

);
}
export default TaskInput;