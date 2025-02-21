import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const api = {
  // Get all notes
  getNotes: async () => {
    const response = await axios.get(`${API_URL}/notes`);
    return response.data;
  },

  // Create a new note
  createNote: async (noteData) => {
    const response = await axios.post(`${API_URL}/notes`, noteData);
    return response.data;
  },

  // Update a note
  updateNote: async (id, noteData) => {
    const response = await axios.put(`${API_URL}/notes/${id}`, noteData);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    await axios.delete(`${API_URL}/notes/${id}`);
  }
};