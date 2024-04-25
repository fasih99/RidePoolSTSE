import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveProfileUrl = async (id, url) => {
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
      profileUrl: url,
    });
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, msg: e.message };
  }
};

export const addRide = async (postData, userId) => {
  try {
    await setDoc(
      doc(db, "rides", userId + "|" + Date.now().toString(36)),
      postData
    );

    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, msg: e.message };
  }
};

export const updateProflie = async (id, data) => {
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
      ...data,
    });
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, msg: e.message };
  }
};
