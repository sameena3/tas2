// src/components/AddTaskForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './AddTaskForm.scss'; // CHANGED: .css to .scss

import { addTask } from '../features/tasks/tasksSlice';

const AddTaskForm = React.memo(({ lists, projects }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState('inbox');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(addTask({
      title,
      description,
      dueDate: dueDate || null,
      listId,
      projectId: projectId || null,
    }));

    setTitle('');
    setDescription('');
    setDueDate('');
    setListId('inbox');
    setProjectId('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="add-task-input"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="add-task-textarea"
        rows="2"
      ></textarea>
      <div className="add-task-options">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="add-task-date-input"
        />
        <select
          value={listId}
          onChange={(e) => setListId(e.target.value)}
          className="add-task-select"
        >
          {lists.map(list => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="add-task-select"
        >
          <option value="">No Project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="add-task-submit-button">
        Add Task
      </button>
    </form>
  );
});

export default AddTaskForm;