// src/components/ListSettingsModal.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Edit2, Trash2, List, Heart, ShoppingCart, User, BookOpen, Film } from 'lucide-react';
import './ListSettingsModal.scss';

import {
  addCustomList,
  updateCustomList,
  deleteCustomList,
  selectCustomLists, // This will be empty initially
} from '../features/tasks/tasksSlice';

// A selection of available icons for custom lists
const availableListIcons = [
  { id: 'List', name: 'Default List', component: List },
  { id: 'Heart', name: 'Heart (Health)', component: Heart },
  { id: 'ShoppingCart', name: 'Shopping Cart', component: ShoppingCart },
  { id: 'User', name: 'User (Personal)', component: User },
  { id: 'BookOpen', name: 'Book (Reading)', component: BookOpen },
  { id: 'Film', name: 'Film (Movies)', component: Film },
];

const ListSettingsModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const customLists = useSelector(selectCustomLists); // Will be an empty array initially

  const [newListName, setNewListName] = useState('');
  const [newListIcon, setNewListIcon] = useState(availableListIcons[0].id);
  const [editingListId, setEditingListId] = useState(null);
  const [editedListName, setEditedListName] = useState('');
  const [editedListIcon, setEditedListIcon] = useState('');

  const handleAddList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      dispatch(addCustomList({
        name: newListName.trim(),
        icon: newListIcon,
      }));
      setNewListName('');
      setNewListIcon(availableListIcons[0].id);
    }
  };

  const handleStartEdit = (list) => {
    setEditingListId(list.id);
    setEditedListName(list.name);
    setEditedListIcon(list.icon);
  };

  const handleSaveEdit = (listId) => {
    if (editedListName.trim()) {
      dispatch(updateCustomList({
        id: listId,
        name: editedListName.trim(),
        icon: editedListIcon,
      }));
      setEditingListId(null);
    }
  };

  const handleDeleteList = (listId) => {
    if (window.confirm('Are you sure you want to delete this list? All associated tasks will be moved to Inbox.')) {
      dispatch(deleteCustomList(listId));
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const getIconComponentForDisplay = (iconName) => {
    const icon = availableListIcons.find(i => i.id === iconName);
    return icon ? icon.component : List;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h2 className="modal-title">Manage Custom Lists</h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <form className="add-list-form" onSubmit={handleAddList}>
            <input
              type="text"
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="list-input"
            />
            <select
              value={newListIcon}
              onChange={(e) => setNewListIcon(e.target.value)}
              className="list-icon-select"
            >
              {availableListIcons.map(icon => (
                <option key={icon.id} value={icon.id}>
                  {icon.name}
                </option>
              ))}
            </select>
            <button type="submit" className="add-list-button">
              <Plus size={18} /> Add
            </button>
          </form>

          <div className="list-list">
            {customLists.length === 0 ? (
                <p className="no-lists-message">No custom lists added yet.</p>
            ) : (
                customLists.map(list => {
                    const IconDisplay = getIconComponentForDisplay(list.icon);
                    return (
                        <div key={list.id} className="list-item-manage">
                            {editingListId === list.id ? (
                            <div className="list-edit-row">
                                <input
                                type="text"
                                value={editedListName}
                                onChange={(e) => setEditedListName(e.target.value)}
                                className="list-input edit-input"
                                />
                                <select
                                value={editedListIcon}
                                onChange={(e) => setEditedListIcon(e.target.value)}
                                className="list-icon-select edit-select"
                                >
                                {availableListIcons.map(icon => (
                                    <option key={icon.id} value={icon.id}>
                                    {icon.name}
                                    </option>
                                ))}
                                </select>
                                <button className="action-button save-button" onClick={() => handleSaveEdit(list.id)}>
                                    Save
                                </button>
                                <button className="action-button cancel-button" onClick={() => setEditingListId(null)}>
                                    Cancel
                                </button>
                            </div>
                            ) : (
                            <>
                                <div className="list-display-name">
                                    <IconDisplay size={16} className="list-item-icon" />
                                    {list.name}
                                </div>
                                <div className="list-actions">
                                    <button className="action-button edit-button" onClick={() => handleStartEdit(list)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="action-button delete-button" onClick={() => handleDeleteList(list.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </>
                            )}
                        </div>
                    );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSettingsModal;