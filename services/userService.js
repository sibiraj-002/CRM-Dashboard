import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "users";
const VALID_ROLES = ["admin", "editor", "author", "viewer"];
const VALID_STATUSES = ["active", "inactive"];

function formatFirestoreError(error, operation) {
    const errorCode = error.code || "unknown_error";
    const errorMessage = error.message || "Unknown error occurred";

    const readableMessages = {
        "permission-denied": "Permission denied. Check Firestore security rules.",
        "not-found": "User not found.",
        "already-exists": "User already exists.",
        unauthenticated: "User must be authenticated to perform this operation.",
        "invalid-argument": "Invalid user data provided.",
        "resource-exhausted": "Resource limit exceeded.",
        "failed-precondition": "Operation failed due to precondition.",
        unavailable: "Firestore service temporarily unavailable.",
        unknown_error: "An unknown error occurred while accessing Firestore.",
    };

    const message = readableMessages[errorCode] || errorMessage;
    return new Error(`${operation}: ${message} [Code: ${errorCode}]`);
}

function normalizeRole(role) {
    if (!VALID_ROLES.includes(role)) {
        throw new Error(`Invalid user role. Expected one of: ${VALID_ROLES.join(", ")}`);
    }

    return role;
}

function normalizeStatus(status) {
    if (!VALID_STATUSES.includes(status)) {
        throw new Error(
            `Invalid user status. Expected one of: ${VALID_STATUSES.join(", ")}`,
        );
    }

    return status;
}

function mapUserDoc(snapshot) {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        uid: data.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        createdAt: data.createdAt?.toDate?.() ?? null,
    };
}

export async function getUsers() {
    const operationName = "getUsers";

    try {
        const usersQuery = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(usersQuery);

        return snapshot.docs.map(mapUserDoc);
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}

export async function getUserById(id) {
    const operationName = "getUserById";

    try {
        const snapshot = await getDoc(doc(db, COLLECTION, id));

        if (!snapshot.exists()) {
            return null;
        }

        return mapUserDoc(snapshot);
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}

export async function updateUserRole(id, role) {
    const operationName = "updateUserRole";

    try {
        await updateDoc(doc(db, COLLECTION, id), {
            role: normalizeRole(role),
        });
    } catch (error) {
        if (!error.code) {
            throw error;
        }

        throw formatFirestoreError(error, operationName);
    }
}

export async function updateUserStatus(id, status) {
    const operationName = "updateUserStatus";

    try {
        await updateDoc(doc(db, COLLECTION, id), {
            status: normalizeStatus(status),
        });
    } catch (error) {
        if (!error.code) {
            throw error;
        }

        throw formatFirestoreError(error, operationName);
    }
}
