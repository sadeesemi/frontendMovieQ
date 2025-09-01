// src/components/MovieList.jsx
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateWatchlist } from '../page/CreateWatchlist';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export function MovieList() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedLists, setSelectedLists] = useState(new Set());
  const [editingList, setEditingList] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      const token = getCookie("token");
      const res = await axios.get(`${API_BASE}/api/watchlists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(res.data);
    } catch (err) {
      console.error("Failed to fetch watchlists", err);
    }
  };

  const handleCreateList = async (name, description) => {
    try {
      const token = getCookie("token");
      const res = await axios.post(
        `${API_BASE}/api/watchlists`,
        { listName: name, description: description || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists([...lists, res.data]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create watchlist", err);
    }
  };

  const handleDeleteLists = async () => {
    try {
      const token = getCookie("token");
      for (let id of selectedLists) {
        await axios.delete(`${API_BASE}/api/watchlists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchWatchlists();
      setSelectedLists(new Set());
      setShowCheckboxes(false);
    } catch (err) {
      console.error("Failed to delete watchlists", err);
    }
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setEditName(list.listName);
    setEditDescription(list.description || '');
  };

  const handleSaveEdit = async () => {
    try {
      const token = getCookie("token");
      const res = await axios.put(
        `${API_BASE}/api/watchlists/${editingList.watchListID}`,
        { listName: editName, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedLists = lists.map((list) =>
        list.watchListID === editingList.watchListID ? res.data : list
      );
      setLists(updatedLists);
      setEditingList(null);
    } catch (err) {
      console.error("Failed to update watchlist", err);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="flex items-center justify-between p-4 bg-gray-700 h-24">
        <h1 className="text-3xl font-bold ml-8">Your Watchlists</h1>
        <div className="flex space-x-4 ml-auto">
          <button
            onClick={() => {
              if (selectedLists.size > 0) {
                handleDeleteLists();
              } else {
                setShowCheckboxes(!showCheckboxes);
              }
            }}
            className="text-gray-400 hover:text-white"
          >
            <Trash2 className="w-5 h-5 mr-4" />
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-red-700"
        >
          <Plus className="w-5 h-5" />
          <span>Create New List</span>
        </button>
      </div>

      <div className="space-y-10 ml-24 mr-40 mt-10">
        {lists.map((list) => (
          <div
            key={list.watchListID}
            className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700"
            onClick={() =>
              navigate(`/watchlist/${list.watchListID}`, {
                state: { listName: list.listName },
              })
            }
          >
            {showCheckboxes && (
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={selectedLists.has(list.watchListID)}
                onChange={(e) => {
                  const updatedSelection = new Set(selectedLists);
                  e.target.checked
                    ? updatedSelection.add(list.watchListID)
                    : updatedSelection.delete(list.watchListID);
                  setSelectedLists(updatedSelection);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Replaced image with stylized first letter */}
            <div className="w-24 h-36 flex items-center justify-center bg-sky-900 text-white rounded-md text-4xl font-bold">
              {list.listName?.charAt(0).toUpperCase() || "?"}
            </div>

           <div className="flex-1">
  <h3 className="text-lg font-semibold">{list.listName}</h3>
  <p className="text-gray-400">{list.movies?.length || 0} Movies</p>
  <p className="text-gray-400 text-sm">
    Created {new Date(list.createdDate).toLocaleString()}
  </p>
  {list.description && (
    <p className="text-gray-400 text-sm mt-1">{list.description}</p>
  )}
</div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditList(list);
              }}
              className="text-gray-400 hover:text-white ml-auto mr-4"
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateWatchlist
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateList}
        />
      )}

      {editingList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Watchlist</h2>
            <label className="block mb-2 text-gray-400">Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white"
            />
            <label className="block mt-4 mb-2 text-gray-400">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setEditingList(null)}
                className="bg-gray-600 px-4 py-2 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-red-600 px-4 py-2 rounded-md text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
