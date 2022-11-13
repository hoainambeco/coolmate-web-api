import { INestApplication } from "@nestjs/common";
import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore/lite";

export function fcmSetup() {
  const firebaseConfig = {
    apiKey: "AIzaSyAr7mLBGCUJ9n-LTuClMmB-D6tO3WSdaAw",
    authDomain: "duantotnghiep-365013.firebaseapp.com",
    projectId: "duantotnghiep-365013",
    storageBucket: "duantotnghiep-365013.appspot.com",
    messagingSenderId: "312498019539",
    appId: "1:312498019539:web:d9b6237e70b2dd0b05c826",
    measurementId: "G-DCHHYM2301"
  };
  return initializeApp(firebaseConfig);
}