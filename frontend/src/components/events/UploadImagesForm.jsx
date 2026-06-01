import { useState } from 'react';
import { uploadEventImages } from '../../api/events';

const UploadImagesForm = ({ eventId, onImagesUploaded }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      for (let file of files) {
        formData.append('images', file);
      }
      await uploadEventImages(eventId, formData);
      setFiles([]);
      onImagesUploaded();
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles(e.target.files)}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={uploading || files.length === 0}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>
    </form>
  );
};

export default UploadImagesForm;