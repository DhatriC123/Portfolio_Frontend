import React, { useState, useEffect } from 'react'; // Added useEffect import
import { PlusCircle, Pencil, Trash2, X, Save, FileText } from 'lucide-react';
import axios from 'axios'; // Added axios import

// Separate NoteForm component
const NoteForm = ({ onSubmit, initialData, onClose, isEditing }) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ title: '', content: '' });
  };

  return (
    <div className="bg-yellow-100 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      <input
        type="text"
        name="title"
        placeholder="Note Title"
        value={formData.title}
        onChange={handleInputChange}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50"
      />
      <textarea
        name="content"
        placeholder="Note Content"
        value={formData.content}
        onChange={handleInputChange}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50"
      />
      <button
        onClick={handleSubmit}
        disabled={!formData.title || !formData.content}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {isEditing ? 'Update Note' : 'Save Note'}
      </button>
    </div>
  );
};

function App() {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/notes');
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (formData) => {
    try {
      const response = await axios.post('http://localhost:8080/notes', {
        title: formData.title,
        content: formData.content
      });
      setNotes([response.data, ...notes]);
      setIsCreating(false);
      setError(null);
    } catch (err) {
      setError('Failed to create note: ' + (err.response?.data?.message || err.message));
    }
  };

  const updateNote = async (formData) => {
    try {
      const response = await axios.put(`http://localhost:8080/notes/${editingId}`, {
        id: editingId,
        title: formData.title,
        content: formData.content
      });
      setNotes(notes.map(note =>
        note.id === editingId ? response.data : note
      ));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError('Failed to update note: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete note: ' + (err.response?.data?.message || err.message));
    }
  };

  const startEditing = (note) => {
    setEditingId(note.id);
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-500" />
            Note Maker
          </h1>
          {!isCreating && !editingId && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <PlusCircle size={20} />
              New Note
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {isCreating && (
          <NoteForm
            onSubmit={createNote}
            initialData={{ title: '', content: '' }}
            onClose={handleCloseForm}
            isEditing={false}
          />
        )}

        {editingId && (
          <NoteForm
            onSubmit={updateNote}
            initialData={notes.find(note => note.id === editingId)}
            onClose={handleCloseForm}
            isEditing={true}
          />
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading notes...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
            {notes.length === 0 && !isCreating && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Notes Yet</h3>
                <p className="text-gray-500">Click the "New Note" button to create your first note!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;