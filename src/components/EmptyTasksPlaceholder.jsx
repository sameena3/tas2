// src/components/EmptyTasksPlaceholder.jsx
import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import './EmptyTasksPlaceholder.scss'; // CHANGED: .css to .scss

const EmptyTasksPlaceholder = ({ listName }) => {
  return (
    <div className="empty-placeholder-container">
      <ClipboardCheck size={64} className="empty-placeholder-icon" />
      <h2 className="empty-placeholder-title">No tasks in "{listName}"</h2>
      <p className="empty-placeholder-text">
        It looks like you've completed everything or haven't added any tasks here yet.
      </p>
    </div>
  );
};

export default EmptyTasksPlaceholder;