import React, { useEffect, useState } from 'react';
import { Clock, Edit, Eye, X, Check, MessageSquare, Trash2 } from 'lucide-react';
import axios from 'axios';
import EditModal from '../components/page/UserRequest/EditModal';
import PreviewModal from '../components/page/UserRequest/PreviewModal';

const API_BASE = 'https://localhost:7119/api/request';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const getToken = () =>
    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

  const fetchRequests = async () => {
    try {
      const token = getToken();
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const buildImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/150x200';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    const trimmed = imgPath.replace(/^\//, '');
    return `${API_BASE.replace('/api/request', '')}/${trimmed}`;
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

 const handleSaveEdit = async () => {
  await fetchRequests();   // 🔥 re-fetch updated list
  setShowEditModal(false);
};




  const changeStatus = async (request, status) => {
    try {
      const token = getToken();
      await axios.patch(`${API_BASE}/${request.requestID}/status?status=${status}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error(`Failed to change status to ${status}:`, err);
    }
  };

  const handleApprove = (request) => changeStatus(request, 'Approved');
  const handleReject = (request) => changeStatus(request, 'Rejected');

  const handleDelete = async (requestID) => {
    try {
      const token = getToken();
      await axios.delete(`${API_BASE}/${requestID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error('Failed to delete request:', err);
    }
  };

  const handlePreview = (request) => {
    setSelectedRequest(request);
    setShowPreviewModal(true);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'bg-yellow-600';
    if (status === 'Approved') return 'bg-green-600';
    if (status === 'Rejected') return 'bg-red-600';
    return 'bg-gray-600';
  };

  const formatYear = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return isNaN(date) ? 'Unknown' : date.getFullYear();
  };

  return (
    <div className="space-y-6 pl-32 pr-32 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">User Movie Requests</h1>
        <div className="flex items-center gap-16 pt-4">
          <div className="flex items-center gap-4 text-gray-400">
            <Clock size={20} />
            <span>{requests.filter((r) => r.status === 'Pending').length} pending</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const genresArray = Array.isArray(request.genres)
            ? request.genres
            : typeof request.genres === 'string'
            ? request.genres.split(',').map((g) => g.trim())
            : [];

          return (
            <div
              key={request.requestID}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-red-600 transition-colors"
            >
              <div className="p-8 flex gap-6">
                <img
                  src={buildImageUrl(request.image)}
                  alt={request.movieTitle}
                  className="w-24 h-36 object-cover rounded-lg"
                />
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-xl">{request.movieTitle}</h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                        request.status
                      )} text-white`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {genresArray.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-blue-600 text-blue-100 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="text-gray-400 mb-2">
                    {formatYear(request.releaseDate)} | {request.duration}
                  </div>

                  <div className="text-gray-400 mb-2">
                    Requested by: {request.user?.email || 'Unknown'}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePreview(request)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Preview
                  </button>

                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleEdit(request)}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <X size={16} />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(request)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                    </>
                  )}

                  {(request.status === 'Rejected' || request.status === 'Approved') && (
                    <button
                      onClick={() => handleDelete(request.requestID)}
                      className="bg-red-800 hover:bg-red-900 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare size={48} className="mx-auto mb-4" />
          <p>No requests found matching your criteria.</p>
        </div>
      )}

      {showEditModal && selectedRequest && (
       <EditModal
  isOpen={showEditModal}
  movie={selectedRequest}
  onClose={() => setShowEditModal(false)}
  onSave={handleSaveEdit}
  token={getToken()}
/>

      )}

      {showPreviewModal && selectedRequest && (
        <PreviewModal
          isOpen={showPreviewModal}
          movie={selectedRequest}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

export default UserRequests;
