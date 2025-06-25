import React from 'react'; // useState and other auth-related hooks are no longer needed here
import { useSelector } from 'react-redux'; // useDispatch is also no longer explicitly needed here

// Import core application components
import './App.scss';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddTaskForm from './components/AddTaskForm';
import TaskItem from './components/TaskItem';
import EmptyTasksPlaceholder from './components/EmptyTasksPlaceholder';

// Import selectors for task-related data from the tasksSlice
import {
  selectFilteredTasks,
  selectViewMode,
  selectAllLists, // Used to pass lists to AddTaskForm
  selectProjects, // Used to pass projects to AddTaskForm
} from './features/tasks/tasksSlice';

// Import the custom hook for task metrics (e.g., current list name)
import { useTaskMetrics } from './hooks/useTaskMetrics';

/**
 * Main application component.
 * This component acts as the layout and orchestrator for all other components.
 * It manages the top-level display based on Redux state but no longer handles
 * user authentication state directly, making it a "single-user" or "guest" experience.
 */
const App = () => {
  // Use the custom hook to get the name of the currently selected list.
  // This is passed to EmptyTasksPlaceholder to make its message dynamic.
  const { currentListName } = useTaskMetrics();

  // Selectors to get data from the Redux store.
  // These components will re-render whenever the selected state changes.
  const displayedTasks = useSelector(selectFilteredTasks); // Get tasks filtered by selected list and search term
  const viewMode = useSelector(selectViewMode);           // Get the current display mode (list/grid)
  const allLists = useSelector(selectAllLists);           // Get all available lists (system + custom) for dropdowns
  const projects = useSelector(selectProjects);           // Get all available projects for dropdowns



  return (
    <div className="app-container">
     
      <Sidebar />

 
      <div className="main-content-area">
      
        <Header />

  
        <div className="task-input-section">
          <AddTaskForm lists={allLists} projects={projects} />
        </div>

        
        <div className="task-list-display-section">
          {displayedTasks.length === 0 ? (
            // If there are no tasks matching the current filters, display the placeholder
            <EmptyTasksPlaceholder listName={currentListName} />
          ) : (
            // If tasks exist, render them in a list or grid layout based on viewMode
            <div className={`tasks-grid-or-list ${viewMode === 'grid' ? 'tasks-grid' : 'tasks-list'}`}>
              {displayedTasks.map(task => (
                // Render each task using the TaskItem component
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default App;
