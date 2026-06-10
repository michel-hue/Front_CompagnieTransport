
export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Renseigne ces valeurs avec la configuration issue de la console Firebase.
 * Par sécurité, préfère charger ces valeurs depuis des variables d’environnement
 * ou un fichier ignoré par git si nécessaire.
 *//*
export const firebaseWebConfig: FirebaseWebConfig = {
/!*  apiKey: environment.FIREBASE_API_KEY,
  authDomain: environment.FIREBASE_AUTH_DOMAIN,
  projectId: environment.FIREBASE_PROJECT_ID,
  storageBucket: environment.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: environment.FIREBASE_MESSAGING_SENDER_ID,
  appId: environment.FIREBASE_APP_ID,*!/
};*/
