import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase.config';
import { Couple, Guest } from './types';

// Generate unique invitation code (6 chars)
export const generateInvitationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// COUPLES OPERATIONS
export const createCouple = async (coupleData: Omit<Couple, 'id' | 'createdAt'>) => {
  const id = doc(collection(db, 'couples')).id;
  const couple: Couple = {
    ...coupleData,
    id,
    createdAt: Timestamp.now().toMillis(),
  };
  
  await setDoc(doc(db, 'couples', id), couple);
  return couple;
};

export const getCoupleById = async (coupleId: string) => {
  const docRef = doc(db, 'couples', coupleId);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Couple | undefined;
};

export const getCouplesByAdmin = async (adminId: string) => {
  const q = query(collection(db, 'couples'), where('adminId', '==', adminId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Couple);
};

export const updateCouple = async (coupleId: string, data: Partial<Couple>) => {
  await updateDoc(doc(db, 'couples', coupleId), data);
};

// GUESTS OPERATIONS
export const addGuests = async (coupleId: string, guestList: Guest[]) => {
  const batch = guestList.map((guest) =>
    setDoc(doc(collection(db, 'guests')), guest)
  );
  await Promise.all(batch);
};

export const getGuestsByCouple = async (coupleId: string) => {
  const q = query(collection(db, 'guests'), where('coupleId', '==', coupleId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Guest);
};

export const getGuestByCode = async (code: string) => {
  const q = query(collection(db, 'guests'), where('invitationCode', '==', code));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0]?.data() as Guest | undefined;
};

export const updateGuestStatus = async (guestId: string, status: 'accepted' | 'declined' | 'pending') => {
  await updateDoc(doc(db, 'guests', guestId), { status });
};

// STATS
export const getInvitationStats = async (coupleId: string) => {
  const guests = await getGuestsByCouple(coupleId);
  return {
    total: guests.length,
    accepted: guests.filter((g) => g.status === 'accepted').length,
    declined: guests.filter((g) => g.status === 'declined').length,
    pending: guests.filter((g) => g.status === 'pending').length,
  };
};
