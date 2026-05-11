import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Candidate } from '../types';

interface CandidateState {
  // Modal & Selection State
  isModalVisible: boolean;
  editingCandidate: Candidate | null;

  // Filter & Search State
  searchTerm: string;
  activeFilters: Record<string, string[]>;

  // Actions
  openModal: (candidate?: Candidate) => void;
  closeModal: () => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Record<string, string[]>) => void;
  clearFilters: () => void;
}

export const useCandidateStore = create<CandidateState>()(
  devtools(
    persist(
      (set) => ({
        isModalVisible: false,
        editingCandidate: null,
        searchTerm: '',
        activeFilters: {},

        openModal: (candidate) => set(
          { isModalVisible: true, editingCandidate: candidate || null },
          false,
          'openModal'
        ),

        closeModal: () => set(
          { isModalVisible: false, editingCandidate: null },
          false,
          'closeModal'
        ),

        setSearchTerm: (term) => set(
          { searchTerm: term },
          false,
          'setSearchTerm'
        ),

        setFilters: (filters) => set(
          { activeFilters: filters },
          false,
          'setFilters'
        ),

        clearFilters: () => set(
          { activeFilters: {}, searchTerm: '' },
          false,
          'clearFilters'
        ),
      }),
      {
        name: 'candidate-storage', // key in local storage
        partialize: (state) => ({
          searchTerm: state.searchTerm,
          activeFilters: state.activeFilters
        }), // Only persist search and filters
      }
    ),
    { name: 'CandidateStore' }
  )
);
