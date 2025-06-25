// src/components/Header.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Grip, Archive } from 'lucide-react';
import './Header.scss'; // CHANGED: .css to .scss

import { selectViewMode, toggleViewMode } from '../features/tasks/tasksSlice';

import { useTaskMetrics } from '../hooks/useTaskMetrics';

const Header = () => {
  const dispatch = useDispatch();

  const { currentListName, totalTasksInCurrentList, completedTasksInCurrentList } = useTaskMetrics();

  const viewMode = useSelector(selectViewMode);

  return (
    <div className="header-container">
      <h1 className="header-title">{currentListName}</h1>

      <div className="header-actions">
        <div className="task-count-display">
          <span className="task-count-text">{completedTasksInCurrentList} / {totalTasksInCurrentList} tasks</span>
        </div>

        <div className="view-mode-toggle">
          <button
            onClick={() => dispatch(toggleViewMode('list'))}
            className={`view-mode-button ${viewMode === 'list' ? 'view-mode-button-active' : ''}`}
          >
            <List size={20} className="view-mode-icon" />
          </button>
          <button
            onClick={() => dispatch(toggleViewMode('grid'))}
            className={`view-mode-button ${viewMode === 'grid' ? 'view-mode-button-active' : ''}`}
          >
            <Grip size={20} className="view-mode-icon" />
          </button>
        </div>

        <button className="header-action-button">
          <Archive size={20} className="header-action-icon" />
        </button>
      </div>
    </div>
  );
};

export default Header;