import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Inbox, Calendar, Clock, Archive, Search, Settings, User, FolderPlus, ListPlus, // Removed: LogOut, LogIn
  List, Heart, ShoppingCart, BookOpen, Film
} from 'lucide-react';
import './Sidebar.scss';

import {
  selectSelectedList,
  setSelectedList,
  selectSearchTerm,
  setSearchTerm,
  selectSystemLists,
  selectCustomLists,
} from '../features/tasks/tasksSlice';

// --- THIS LINE MUST BE REMOVED/COMMENTED OUT TO FIX THE ERROR ---
// import { selectIsAuthenticated, selectUser, logout } from '../features/auth/authSlice';


import { useTaskMetrics } from '../hooks/useTaskMetrics';
import ProjectSettingsModal from './ProjectSettingsModal';
import ListSettingsModal from './ListSettingsModal';

// Removed: isAuthenticated and onAuthModalOpen are no longer passed as props
const Sidebar = () => {
  const dispatch = useDispatch();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const selectedList = useSelector(selectSelectedList);
  const searchTerm = useSelector(selectSearchTerm);
  const systemLists = useSelector(selectSystemLists);
  const customLists = useSelector(selectCustomLists);
  // Removed: const user = useSelector(selectUser); // This line also needs to be gone

  const { listsWithCounts, projectsWithCounts } = useTaskMetrics();

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Inbox': return Inbox;
      case 'Calendar': return Calendar;
      case 'Clock': return Clock;
      case 'Archive': return Archive;
      case 'Heart': return Heart;
      case 'User': return User;
      case 'ShoppingCart': return ShoppingCart;
      case 'BookOpen': return BookOpen;
      case 'Film': return Film;
      case 'List': return List;
      default: return List;
    }
  };

  // Removed: handleLogout function

  return (
    <div className="sidebar-container">
      <div className="user-profile">
        <div className="user-profile-content">
          <div className="user-avatar-wrapper">
            <User className="user-avatar-icon" size={16} />
          </div>
          <div>
            {/* User profile section simplified to show 'Guest' */}
            <div className="user-name">Guest</div>
            <div className="user-plan">Local Mode</div> {/* Indicate no login */}
          </div>
        </div>
      </div>

      <div className="sidebar-search-wrapper">
        <div className="search-input-container">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            // Removed: disabled={!isAuthenticated}
          />
        </div>
      </div>

      <div className="sidebar-scroll-area">
        <div className="sidebar-list-section">
          <div className="list-section-title">
            Lists
            {/* Manage lists button is now always available */}
            <button
              className="manage-lists-button"
              onClick={() => setIsListModalOpen(true)}
              title="Manage Lists"
            >
              <ListPlus size={16} />
            </button>
          </div>
          {systemLists.map(list => {
            const Icon = getIconComponent(list.icon);
            const listWithCount = listsWithCounts.find(l => l.id === list.id);
            // Removed: disabled-item class based on authentication
            const listItemClasses = `sidebar-list-item ${selectedList === list.id ? 'sidebar-list-item-selected' : ''}`;
            return (
              <div
                key={list.id}
                onClick={() => dispatch(setSelectedList(list.id))} // Always allow selection
                className={listItemClasses}
              >
                <div className="list-item-content">
                  {Icon && <Icon size={16} className="list-item-icon" />}
                  <span className="list-item-name">{list.name}</span>
                </div>
                {listWithCount?.count > 0 && ( // Always show count if > 0
                  <span className="list-item-count">
                    {listWithCount.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom list section is now always visible if lists exist */}
        {customLists.length > 0 && (
          <div className="sidebar-custom-list-section">
            <div className="project-section-title">
                Custom Lists
            </div>
            {customLists.map(list => {
              const Icon = getIconComponent(list.icon);
              const listWithCount = listsWithCounts.find(l => l.id === list.id);
              const listItemClasses = `sidebar-list-item ${selectedList === list.id ? 'sidebar-list-item-selected' : ''}`;
              return (
                <div
                  key={list.id}
                  onClick={() => dispatch(setSelectedList(list.id))}
                  className={listItemClasses}
                >
                  <div className="list-item-content">
                    {Icon && <Icon size={16} className="list-item-icon" />}
                    <span className="list-item-name">{list.name}</span>
                  </div>
                  {listWithCount?.count > 0 && (
                    <span className="list-item-count">
                      {listWithCount.count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Projects section is now always visible */}
        <div className="sidebar-project-section">
          <div className="project-section-title">
            Projects
            <button
              className="manage-projects-button"
              onClick={() => setIsProjectModalOpen(true)}
              title="Manage Projects"
            >
              <FolderPlus size={16} />
            </button>
          </div>
          {projectsWithCounts.map(project => (
            <div
              key={project.id}
              onClick={() => dispatch(setSelectedList(project.id))}
              className={`sidebar-list-item ${selectedList === project.id ? 'sidebar-list-item-selected' : ''}`}
            >
              <div className="list-item-content">
                <div className={`project-color-dot ${project.color || 'project-color-gray'}`}></div>
                <span className="list-item-name">{project.name}</span>
              </div>
              {project.count > 0 && (
                <span className="list-item-count">
                  {project.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-settings-section">
        <div className="settings-item">
          <Settings size={16} className="settings-icon" />
          <span className="settings-text">Settings</span>
        </div>
        {/* Removed: Conditional Login/Logout buttons. You can add a static settings link or remove this part */}
        {/*
        {isAuthenticated ? (
          <div className="settings-item logout-button" onClick={handleLogout}>
            <LogOut size={16} className="settings-icon" />
            <span className="settings-text">Logout</span>
          </div>
        ) : (
          <div className="settings-item login-button" onClick={onAuthModalOpen}>
            <LogIn size={16} className="settings-icon" />
            <span className="settings-text">Login / Register</span>
          </div>
        )}
        */}
      </div>

      {/* Modals are now always renderable based on local state (no isAuthenticated check here) */}
      {isProjectModalOpen && (
        <ProjectSettingsModal onClose={() => setIsProjectModalOpen(false)} />
      )}
      {isListModalOpen && (
        <ListSettingsModal onClose={() => setIsListModalOpen(false)} />
      )}
    </div>
  );
};

export default Sidebar;
