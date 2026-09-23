import { CustomerFeedback } from '../types';

const STORAGE_KEY = 'kimmo_restaurant_feedbacks_v2';

export const INITIAL_SAMPLE_FEEDBACKS: CustomerFeedback[] = [];

export function getStoredFeedbacks(): CustomerFeedback[] {
  try {
    // Clear legacy sample data if present
    if (localStorage.getItem('kimmo_restaurant_feedbacks_v1')) {
      localStorage.removeItem('kimmo_restaurant_feedbacks_v1');
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFeedbackToStorage(feedback: CustomerFeedback): CustomerFeedback[] {
  const current = getStoredFeedbacks();
  const updated = [feedback, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save feedback to localStorage', err);
  }
  return updated;
}

export function updateFeedbackInStorage(
  id: string,
  status: CustomerFeedback['status'],
  note?: string
): CustomerFeedback[] {
  const current = getStoredFeedbacks();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        resolutionNote: note !== undefined ? note : item.resolutionNote,
        resolvedAt: status === 'resolved' ? new Date().toISOString() : item.resolvedAt,
      };
    }
    return item;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update feedback in localStorage', err);
  }
  return updated;
}

export function deleteFeedbackFromStorage(id: string): CustomerFeedback[] {
  const current = getStoredFeedbacks();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete feedback from localStorage', err);
  }
  return updated;
}

export function resetFeedbacksStorage(): CustomerFeedback[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_FEEDBACKS));
  } catch (err) {
    console.error('Failed to reset feedback in localStorage', err);
  }
  return INITIAL_SAMPLE_FEEDBACKS;
}
