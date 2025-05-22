import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Dashboard({ onLogout }) {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await API.get('/videos');
      setVideos(data);
    } catch (err) {
      alert('Failed to fetch videos');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a video file first');
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('token');

      await fetch(`${API.defaults.baseURL}/videos/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: selectedFile,
      });

      setSelectedFile(null);
      fetchVideos();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await API.delete(`/videos/${id}`);
      setVideos(videos.filter((video) => video._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 flex items-center gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>

      {/* Video list */}
      <div>
        {videos.length === 0 ? (
          <p className="text-center text-gray-500">No videos uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {videos.map((video) => (
              <li
                key={video._id}
                className="flex justify-between items-center border p-4 rounded"
              >
                <div>
                  <p className="font-semibold">{video.originalFilename || 'Untitled'}</p>
                  <video
                    src={video.url}
                    controls
                    className="w-64 rounded mt-2"
                  />
                </div>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
