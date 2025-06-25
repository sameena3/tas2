// src/components/TaskItem.jsx
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ChevronDown, Trash2, Edit, Save, X } from 'lucide-react';
import './TaskItem.scss'; // CHANGED: .css to .scss

import { toggleComplete, deleteTask, updateTask } from '../features/tasks/tasksSlice';

const TaskItem = React.memo(({ task }) => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = useCallback(() => {
    dispatch(updateTask({
      id: task.id,
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate,
      listId: task.listId,
      projectId: task.projectId,
    }));
    setIsEditing(false);
  }, [dispatch, task.id, editedTitle, editedDescription, editedDueDate, task.listId, task.projectId]);

  const handleCancelEdit = useCallback(() => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDueDate(task.dueDate);
    setIsEditing(false);
  }, [task.title, task.description, task.dueDate]);

  const getDueDateClass = (dateString) => {
    if (!dateString) return '';
    const today = new Date().toISOString().slice(0, 10);
    if (dateString < today && !task.completed) {
      return 'task-overdue';
    }
    return '';
  };

  const dueDateClass = getDueDateClass(task.dueDate);

  return (
    <div className={`task-item-card ${isExpanded ? 'task-item-expanded' : ''}`}>
      <div className="task-item-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => dispatch(toggleComplete(task.id))}
          className="task-checkbox"
        />
        {isEditing ? (
          <div className="task-edit-fields">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="task-edit-input"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setDescription(e.target.value)}
              className="task-edit-textarea"
              rows="2"
            ></textarea>
            <input
              type="date"
              value={editedDueDate || ''}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="task-edit-date-input"
            />
          </div>
        ) : (
          <div className="task-content">
            <span className={`task-title ${task.completed ? 'task-title-completed' : ''}`}>
              {task.title}
            </span>
            {task.dueDate && (
              <span className={`task-due-date ${dueDateClass}`}>
                Due: {task.dueDate}
              </span>
            )}
            {task.projectId && (
              <span className={`task-project-tag ${task.projectId.replace('bg-', 'project-color-')}`}>
                {task.projectId}
              </span>
            )}
          </div>
        )}

        <div className="task-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="action-button save-button">
                <Save size={16} />
              </button>
              <button onClick={handleCancelEdit} className="action-button cancel-button">
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="action-button edit-button">
                <Edit size={16} />
              </button>
              <button onClick={() => dispatch(deleteTask(task.id))} className="action-button delete-button">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="action-button expand-button">
                <ChevronDown size={16} className={isExpanded ? 'expand-icon-rotated' : ''} />
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded && !isEditing && task.description && (
        <div className="task-description-expanded">
          {task.description}
        </div>
      )}
    </div>
  );
});

export default TaskItem;