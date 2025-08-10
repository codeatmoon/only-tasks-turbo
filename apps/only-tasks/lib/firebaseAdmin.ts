import { App, cert, getApp, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Reads FIREBASE_* env vars and initializes the Admin SDK once (safe in Next.js dev/SSR)
// Note: Do NOT use this in Edge runtime routes — Admin SDK requires Node.js runtime.

type RequiredEnv = {
    projectId: string;
    clientEmail: string;
    privateKey: string;
};

function readEnv(): RequiredEnv | null {
    // All values come from individual env vars
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!projectId || !clientEmail || !privateKey) return null;
    privateKey = privateKey.replace(/\\n/g, '\n');
    return { projectId, clientEmail, privateKey };
}

function initFirebaseAdmin(): App | null {
    if (getApps().length) return getApp();
    const env = readEnv();
    if (!env) return null;
    const serviceAccount: ServiceAccount = {
        projectId: env.projectId,
        clientEmail: env.clientEmail,
        privateKey: env.privateKey,
    };
    return initializeApp({ credential: cert(serviceAccount) });
}

export const firebaseAdminApp = initFirebaseAdmin();
export const adminAuth = firebaseAdminApp ? getAuth(firebaseAdminApp) : undefined;
export const adminDb = firebaseAdminApp ? getFirestore(firebaseAdminApp) : undefined;

export function getFirebaseAdminOrThrow(): App {
    if (!firebaseAdminApp) {
        throw new Error(
            'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
        );
    }
    return firebaseAdminApp;
}

export type { App as FirebaseAdminApp };
