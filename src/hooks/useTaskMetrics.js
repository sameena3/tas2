// src/hooks/useTaskMetrics.js
import { useSelector } from 'react-redux';
import {
  selectListsWithCounts,
  selectProjectsWithCounts,
  selectCurrentListName,
  selectTotalTasksInCurrentList,
  selectCompletedTasksInCurrentList,
  selectSelectedList,
  selectSystemLists,
  selectCustomLists,
  selectProjects
} from '../features/tasks/tasksSlice';

export const useTaskMetrics = () => {
  const listsWithCounts = useSelector(selectListsWithCounts);
  const projectsWithCounts = useSelector(selectProjectsWithCounts);
  const currentListName = useSelector(selectCurrentListName);
  const totalTasksInCurrentList = useSelector(selectTotalTasksInCurrentList);
  const completedTasksInCurrentList = useSelector(selectCompletedTasksInCurrentList);

  const selectedListId = useSelector(selectSelectedList);
  const systemLists = useSelector(selectSystemLists);
  const customLists = useSelector(selectCustomLists);
  const projects = useSelector(selectProjects);

  const isSystemList = systemLists.some(list => list.id === selectedListId);
  const isCustomList = customLists.some(list => list.id === selectedListId);
  const isProject = projects.some(project => project.id === selectedListId || selectedListId === 'no-project');

  return {
    listsWithCounts,
    projectsWithCounts,
    currentListName,
    totalTasksInCurrentList,
    completedTasksInCurrentList,
    selectedListId,
    isSystemList,
    isCustomList,
    isProject
  };
};