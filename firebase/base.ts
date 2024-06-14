/*
import { Buffer } from 'buffer';
import { ServiceAccount } from 'firebase-admin';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 環境変数からサービスアカウントの資格情報を取得
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;
if (serviceAccountPath == undefined || serviceAccountPath == null) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT環境変数が設定されていません');
}

try {
  // Base64エンコードされた資格情報をデコード
  const firebaseSecretBinary = Buffer.from(serviceAccountPath, 'base64');
  const firebaseSecret: ServiceAccount = JSON.parse(
    firebaseSecretBinary.toString(),
  ) as ServiceAccount;

  // すでにFirebaseアプリが初期化されていない場合に初期化
  if (!getApps().length) {
    initializeApp({
      credential: cert(firebaseSecret),
    });
  }
} catch (error: unknown) {
  if (error instanceof Error) {
    throw new Error('Firebaseサービスアカウントの初期化中にエラーが発生しました: ' + error.message);
  } else {
    throw new Error('Firebaseサービスアカウントの初期化中に不明なエラーが発生しました');
  }
}

// Firestoreデータベースのインスタンスを取得
const db = getFirestore();

export default db;
*/
