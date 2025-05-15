import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(file: File, path: string): Promise<string> {
  // path e.g. `properties/${userId}/${timestamp}_${file.name}`
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}