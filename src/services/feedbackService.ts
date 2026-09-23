import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { CustomerFeedback, FeedbackStatus } from '../types';
import {
  getStoredFeedbacks,
  saveFeedbackToStorage,
  updateFeedbackInStorage,
  deleteFeedbackFromStorage,
  resetFeedbacksStorage,
} from '../utils/storage';

const FEEDBACKS_COLLECTION = 'feedbacks';

/**
 * Subscribes to real-time feedback updates across all devices from Firestore.
 * Automatically synchronizes with local storage as a resilient offline backup.
 */
export function subscribeToFeedbacks(
  onUpdate: (feedbacks: CustomerFeedback[]) => void
): () => void {
  try {
    const q = query(
      collection(db, FEEDBACKS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: CustomerFeedback[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as CustomerFeedback);
        });
        // Update local storage backup
        try {
          localStorage.setItem('kimmo_restaurant_feedbacks_v2', JSON.stringify(items));
        } catch (e) {
          console.warn('LocalStorage sync warning:', e);
        }
        onUpdate(items);
      },
      (error) => {
        console.error('Firestore real-time sync error, falling back to local cache:', error);
        onUpdate(getStoredFeedbacks());
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Failed to attach Firestore snapshot listener:', error);
    onUpdate(getStoredFeedbacks());
    return () => {};
  }
}

/**
 * Saves a new feedback to Firestore and notifies all listening devices in real time.
 */
export async function addFeedback(feedback: CustomerFeedback): Promise<void> {
  // Save to local storage immediately for responsive offline feedback
  saveFeedbackToStorage(feedback);

  try {
    const docRef = doc(db, FEEDBACKS_COLLECTION, feedback.id);
    await setDoc(docRef, feedback);
  } catch (error) {
    console.error('Error saving feedback to Firestore:', error);
    throw error;
  }
}

/**
 * Updates status and resolution note in Firestore.
 */
export async function updateFeedback(
  id: string,
  status: FeedbackStatus,
  note?: string
): Promise<void> {
  updateFeedbackInStorage(id, status, note);

  try {
    const docRef = doc(db, FEEDBACKS_COLLECTION, id);
    const updates: Partial<CustomerFeedback> = {
      status,
      ...(note !== undefined ? { resolutionNote: note } : {}),
      ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}),
    };
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating feedback in Firestore:', error);
    throw error;
  }
}

/**
 * Deletes a feedback item from Firestore across all devices.
 */
export async function deleteFeedback(id: string): Promise<void> {
  deleteFeedbackFromStorage(id);

  try {
    const docRef = doc(db, FEEDBACKS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting feedback from Firestore:', error);
    throw error;
  }
}

/**
 * Clears all feedback entries from Firestore across all devices.
 */
export async function clearAllFeedbacks(): Promise<void> {
  resetFeedbacksStorage();

  try {
    const snapshot = await getDocs(collection(db, FEEDBACKS_COLLECTION));
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error clearing all feedbacks in Firestore:', error);
  }
}
