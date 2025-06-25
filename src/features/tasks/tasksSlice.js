// src/features/tasks/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  // SYSTEM LISTS - These are fixed and have special filtering logic
  systemLists: [
    { id: 'inbox', name: 'Inbox', icon: 'Inbox' },
    { id: 'today', name: 'Today', icon: 'Calendar' },
    { id: 'upcoming', name: 'Upcoming', icon: 'Clock' },
    { id: 'archive', name: 'Archive', icon: 'Archive' },
  ],
  // CUSTOM LISTS - These are user-defined and start empty
  customLists: [], // THIS IS THE KEY CHANGE: Starts empty

  projects: [
    { id: 'work', name: 'Work', color: 'project-color-blue-500' },
    { id: 'home-tasks', name: 'Home Tasks', color: 'project-color-green-500' },
  ],
  tasks: [
    { id: '1', title: 'Buy groceries', description: 'Milk, Eggs, Bread', dueDate: '2025-06-25', listId: 'today', projectId: 'home-tasks', completed: false },
    { id: '2', title: 'Prepare presentation', description: 'For client meeting', dueDate: '2025-06-26', listId: 'upcoming', projectId: 'work', completed: false },
    { id: '3', title: 'Call mechanic', description: 'Service car', dueDate: '2025-06-24', listId: 'inbox', projectId: null, completed: true },
    { id: '4', title: 'Write report', description: 'Q2 financial report', dueDate: '2025-06-28', listId: 'upcoming', projectId: 'work', completed: false },
    // Removed example tasks tied to 'health', 'personal', 'shopping' directly
    // since those lists will no longer exist by default.
  ],
  selectedList: 'inbox',
  searchTerm: '',
  viewMode: 'list',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      // Ensure default listId if not provided (e.g., if custom list is empty)
      const listId = action.payload.listId || 'inbox';
      state.tasks.push({ id: Date.now().toString(), completed: false, ...action.payload, listId });
    },
    toggleComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTask: (state, action) => {
      const { id, title, description, dueDate, listId, projectId } = action.payload;
      const existingTask = state.tasks.find(task => task.id === id);
      if (existingTask) {
        existingTask.title = title;
        existingTask.description = description;
        existingTask.dueDate = dueDate;
        existingTask.listId = listId;
        existingTask.projectId = projectId;
      }
    },
    setSelectedList: (state, action) => {
      state.selectedList = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    toggleViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    // Project Reducers (as previously defined)
    addProject: (state, action) => {
      const newProject = {
        id: action.payload.id || Date.now().toString(),
        name: action.payload.name,
        color: action.payload.color || 'project-color-gray',
      };
      state.projects.push(newProject);
    },
    updateProject: (state, action) => {
      const { id, name, color } = action.payload;
      const existingProject = state.projects.find(project => project.id === id);
      if (existingProject) {
        existingProject.name = name || existingProject.name;
        existingProject.color = color || existingProject.color;
      }
    },
    deleteProject: (state, action) => {
      const projectIdToDelete = action.payload;
      state.projects = state.projects.filter(project => project.id !== projectIdToDelete);
      state.tasks = state.tasks.map(task =>
        task.projectId === projectIdToDelete ? { ...task, projectId: null } : task
      );
      if (state.selectedList === projectIdToDelete) {
        state.selectedList = 'inbox';
      }
    },
    // NEW REDUCERS FOR CUSTOM LISTS
    addCustomList: (state, action) => {
      const newCustomList = {
        id: action.payload.id || Date.now().toString(),
        name: action.payload.name,
        icon: action.payload.icon || 'List', // Default icon for custom lists
      };
      state.customLists.push(newCustomList);
    },
    updateCustomList: (state, action) => {
      const { id, name, icon } = action.payload;
      const existingList = state.customLists.find(list => list.id === id);
      if (existingList) {
        existingList.name = name || existingList.name;
        existingList.icon = icon || existingList.icon;
      }
    },
    deleteCustomList: (state, action) => {
      const listIdToDelete = action.payload;
      state.customLists = state.customLists.filter(list => list.id !== listIdToDelete);
      // Also, update tasks that were associated with this custom list
      state.tasks = state.tasks.map(task =>
        task.listId === listIdToDelete ? { ...task, listId: 'inbox' } : task // Move tasks to inbox
      );
      // If the deleted list was the selected one, reset to inbox
      if (state.selectedList === listIdToDelete) {
        state.selectedList = 'inbox';
      }
    },
  },
});

export const {
  addTask,
  toggleComplete,
  deleteTask,
  updateTask,
  setSelectedList,
  setSearchTerm,
  toggleViewMode,
  addProject,
  updateProject,
  deleteProject,
  addCustomList,
  updateCustomList,
  deleteCustomList,
} = tasksSlice.actions;

export default tasksSlice.reducer;

// --- Selectors ---

const selectTasksState = (state) => state.tasks.tasks;
const selectSelectedListIdState = (state) => state.tasks.selectedList;
const selectSearchTermState = (state) => state.tasks.searchTerm;
export const selectSystemLists = (state) => state.tasks.systemLists;
export const selectCustomLists = (state) => state.tasks.customLists;
export const selectProjects = (state) => state.tasks.projects;
export const selectViewMode = (state) => state.tasks.viewMode;

export const selectSelectedList = (state) => state.tasks.selectedList;
export const selectSearchTerm = (state) => state.tasks.searchTerm;

// COMBINED LISTS SELECTOR - Used for AddTaskForm and potentially some metrics
export const selectAllLists = createSelector( // <-- EXPORT IS HERE
  [selectSystemLists, selectCustomLists],
  (systemLists, customLists) => {
    return [...systemLists, ...customLists]; // Combine them
  }
);


export const selectFilteredTasks = createSelector(
  [selectTasksState, selectSelectedListIdState, selectSearchTermState, selectSystemLists, selectCustomLists],
  (allTasks, selectedListId, searchTerm, systemLists, customLists) => {
    let filtered = allTasks;

    const isSystemListSelected = systemLists.some(list => list.id === selectedListId);
    const isCustomListSelected = customLists.some(list => list.id === selectedListId);

    if (isSystemListSelected) {
      if (selectedListId === 'inbox') {
        filtered = filtered.filter(task => !task.completed);
      } else if (selectedListId === 'today') {
        const today = new Date().toISOString().slice(0, 10);
        filtered = filtered.filter(task => !task.completed && task.dueDate === today);
      } else if (selectedListId === 'upcoming') {
        const today = new Date().toISOString().slice(0, 10);
        filtered = filtered.filter(task => !task.completed && task.dueDate > today);
      } else if (selectedListId === 'archive') {
        filtered = filtered.filter(task => task.completed);
      }
    } else if (isCustomListSelected) {
      // For custom lists, filter by their listId and not completed
      filtered = filtered.filter(task => task.listId === selectedListId && !task.completed);
    } else {
      // Handle project selection or 'no-project'
      if (selectedListId === 'no-project') {
        filtered = filtered.filter(task => !task.completed && task.projectId === null);
      } else {
        // If it's not a system list or a custom list, assume it's a project
        filtered = filtered.filter(task => task.projectId === selectedListId && !task.completed);
      }
    }

    // Then, filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  }
);

export const selectCurrentListName = createSelector(
  [selectSelectedListIdState, selectSystemLists, selectCustomLists, selectProjects],
  (selectedListId, systemLists, customLists, projects) => {
    const foundInSystemLists = systemLists.find(list => list.id === selectedListId);
    if (foundInSystemLists) {
      return foundInSystemLists.name;
    }
    const foundInCustomLists = customLists.find(list => list.id === selectedListId);
    if (foundInCustomLists) {
      return foundInCustomLists.name;
    }
    if (selectedListId === 'no-project') {
      return 'No Project';
    }
    return projects.find(project => project.id === selectedListId)?.name || 'All Tasks'; // Fallback
  }
);

export const selectTotalTasksInCurrentList = createSelector(
  [selectFilteredTasks],
  (filteredTasks) => filteredTasks.length
);

export const selectCompletedTasksInCurrentList = createSelector(
  [selectFilteredTasks],
  (filteredTasks) => filteredTasks.filter(task => task.completed).length
);

// Modified selectListsWithCounts to include custom lists for proper counts
export const selectListsWithCounts = createSelector(
  [selectSystemLists, selectCustomLists, selectTasksState],
  (systemLists, customLists, allTasks) => {
    // Combine system and custom lists for consistent iteration
    const allCombinedLists = [...systemLists, ...customLists];

    return allCombinedLists.map(list => {
      let count = 0;
      if (list.id === 'inbox') {
        count = allTasks.filter(task => !task.completed).length;
      } else if (list.id === 'today') {
        const today = new Date().toISOString().slice(0, 10);
        count = allTasks.filter(task => !task.completed && task.dueDate === today).length;
      } else if (list.id === 'upcoming') {
        const today = new Date().toISOString().slice(0, 10);
        count = allTasks.filter(task => !task.completed && task.dueDate > today).length;
      } else if (list.id === 'archive') {
        count = allTasks.filter(task => task.completed).length;
      } else {
        // For custom lists, count tasks assigned to that listId
        count = allTasks.filter(task => !task.completed && task.listId === list.id).length;
      }
      return { ...list, count };
    });
  }
);

export const selectProjectsWithCounts = createSelector(
  [selectProjects, selectTasksState],
  (projects, allTasks) => {
    const dynamicProjectsWithCounts = projects.map(project => {
      const count = allTasks.filter(task => !task.completed && task.projectId === project.id).length;
      return { ...project, count };
    });

    const noProjectCount = allTasks.filter(task => !task.completed && task.projectId === null).length;
    dynamicProjectsWithCounts.unshift({
      id: 'no-project',
      name: 'No Project',
      color: 'project-color-gray',
      count: noProjectCount
    });

    return dynamicProjectsWithCounts;
  }
);