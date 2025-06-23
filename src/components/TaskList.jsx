import React, { useContext } from "react";
import '../styles/TaskList.scss';


import { TaskContext } from "./TodoContext";
function TaskList( ) {
  const { pendingtasks, completedtaks, deletetask,toggletask,Clearall} = useContext(TaskContext);
    if (pendingtasks.length === 0 && completedtaks.length === 0) {
  return <p className="empty">📭No tasks yet!!!</p>;
}

  

    return(
        <>
         <div className="pendcont">
            <h1>pending task 📝</h1>
            { pendingtasks.length === 0?(<p>No pending tasks🎉</p>):(
            <ul>
    {pendingtasks.map((t)=>(
        <li key={t.id}>
{/*key is a internally react special prop*/} 
             <input
            type="checkbox"
            onChange={() => toggletask(t.id)}
          />
         {t.text}
<button onClick={()=>deletetask(t.id)}>delete</button>
        </li>
    ))} 

      </ul>)}
      </div>
      <div className="comp-cont">
      <h2>completed task ✅ </h2>
        { completedtaks.length === 0?(<p>🕓No completed  tasks</p>):(
            <ul>
    {completedtaks.map((t)=>(
        <li key={t.id}>
            {t.text}
<button onClick={()=>deletetask(t.id)}>delete</button>
        </li>
    ))} 

      </ul>)}
    <button onClick={Clearall}>Clear</button>
  
    </div>
    </>
    );
}
export default TaskList;

