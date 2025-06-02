import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from "../config/firebase.js";
import axios from "axios";

firebase.initializeFirebaseApp();

const storage = getStorage();

export async function uploadImageToFirebase(imageUrl, filename) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, buffer, {
        contentType: 'image/jpeg'
    });

    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}
