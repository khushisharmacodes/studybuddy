import { create } from 'zustand';
import journalService from '../services/journalService.js';

const useJournalStore = create((set, get) => ({
  journals: [],
  isLoading: false,

  fetchJournals: async (search) => {
    set({ isLoading: true });
    try {
      const { data } = await journalService.getJournals(search);
      set({ journals: data.journals, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch journals:', error);
      set({ isLoading: false });
    }
  },

  addJournal: async (journalData) => {
    const { data } = await journalService.createJournal(journalData);
    set({ journals: [data.journal, ...get().journals] });
  },

  deleteJournal: async (id) => {
    try {
      await journalService.deleteJournal(id);
      set({ journals: get().journals.filter((j) => j._id !== id) });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useJournalStore;
