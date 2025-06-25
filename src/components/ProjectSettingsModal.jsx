// src/components/ProjectSettingsModal.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import './ProjectSettingsModal.scss';

import {
  addProject,
  updateProject,
  deleteProject,
  selectProjects,
} from '../features/tasks/tasksSlice';

const availableProjectColors = [
  { id: 'project-color-red-500', name: 'Red' },
  { id: 'project-color-blue-500', name: 'Blue' },
  { id: 'project-color-green-500', name: 'Green' },
  { id: 'project-color-yellow-500', name: 'Yellow' },
  { id: 'project-color-purple-500', name: 'Purple' },
  { id: 'project-color-gray', name: 'Gray' },
];

const ProjectSettingsModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(availableProjectColors[0].id);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProjectName, setEditedProjectName] = useState('');
  const [editedProjectColor, setEditedProjectColor] = useState('');

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      dispatch(addProject({
        name: newProjectName.trim(),
        color: newProjectColor,
      }));
      setNewProjectName('');
      setNewProjectColor(availableProjectColors[0].id);
    }
  };

  const handleStartEdit = (project) => {
    setEditingProjectId(project.id);
    setEditedProjectName(project.name);
    setEditedProjectColor(project.color);
  };

  const handleSaveEdit = (projectId) => {
    if (editedProjectName.trim()) {
      dispatch(updateProject({
        id: projectId,
        name: editedProjectName.trim(),
        color: editedProjectColor,
      }));
      setEditingProjectId(null);
    }
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be moved to "No Project".')) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h2 className="modal-title">Manage Projects</h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <form className="add-project-form" onSubmit={handleAddProject}>
            <input
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="project-input"
            />
            <select
              value={newProjectColor}
              onChange={(e) => setNewProjectColor(e.target.value)}
              className="project-color-select"
            >
              {availableProjectColors.map(color => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
            <button type="submit" className="add-project-button">
              <Plus size={18} /> Add
            </button>
          </form>

          <div className="project-list">
            {projects.length === 0 ? (
                <p className="no-projects-message">No projects added yet.</p>
            ) : (
                projects.map(project => (
                    <div key={project.id} className="project-item-manage">
                        {editingProjectId === project.id ? (
                        <div className="project-edit-row">
                            <input
                            type="text"
                            value={editedProjectName}
                            onChange={(e) => setEditedProjectName(e.target.value)}
                            className="project-input edit-input"
                            />
                            <select
                            value={editedProjectColor}
                            onChange={(e) => setEditedProjectColor(e.target.value)}
                            className="project-color-select edit-select"
                            >
                            {availableProjectColors.map(color => (
                                <option key={color.id} value={color.id}>
                                {color.name}
                                </option>
                            ))}
                            </select>
                            <button className="action-button save-button" onClick={() => handleSaveEdit(project.id)}>
                                Save
                            </button>
                            <button className="action-button cancel-button" onClick={() => setEditingProjectId(null)}>
                                Cancel
                            </button>
                        </div>
                        ) : (
                        <>
                            <div className="project-display-name">
                                <div className={`project-color-dot ${project.color || 'project-color-gray'}`}></div>
                                {project.name}
                            </div>
                            <div className="project-actions">
                                <button className="action-button edit-button" onClick={() => handleStartEdit(project)}>
                                    <Edit2 size={16} />
                                </button>
                                <button className="action-button delete-button" onClick={() => handleDeleteProject(project.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </>
                        )}
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsModal;