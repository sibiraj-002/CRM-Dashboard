import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "scheduledPosts";
const VALID_STATUSES = ["scheduled", "published", "cancelled"];

function formatFirestoreError(error, operation) {
    const errorCode = error.code || "unknown_error";
    const errorMessage = error.message || "Unknown error occurred";

    const readableMessages = {
        "permission-denied": "Permission denied. Check Firestore security rules.",
        "not-found": "Schedule not found.",
        "already-exists": "Schedule already exists.",
        unauthenticated: "User must be authenticated to perform this operation.",
        "invalid-argument": "Invalid schedule data provided.",
        "resource-exhausted": "Resource limit exceeded.",
        "failed-precondition": "Operation failed due to precondition.",
        unavailable: "Firestore service temporarily unavailable.",
        unknown_error: "An unknown error occurred while accessing Firestore.",
    };

    const message = readableMessages[errorCode] || errorMessage;
    return new Error(`${operation}: ${message} [Code: ${errorCode}]`);
}

function normalizeScheduledAt(scheduledAt) {
    if (!scheduledAt) {
        return null;
    }

    if (scheduledAt instanceof Date) {
        return scheduledAt;
    }

    return new Date(scheduledAt);
}

function normalizeStatus(status) {
    const nextStatus = status || "scheduled";

    if (!VALID_STATUSES.includes(nextStatus)) {
        throw new Error(
            `Invalid schedule status. Expected one of: ${VALID_STATUSES.join(", ")}`,
        );
    }

    return nextStatus;
}

function mapScheduleDoc(snapshot) {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        contentType: data.contentType,
        contentId: data.contentId,
        title: data.title,
        scheduledAt: data.scheduledAt?.toDate?.() ?? data.scheduledAt ?? null,
        status: data.status,
        createdAt: data.createdAt?.toDate?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.() ?? null,
    };
}

export async function createSchedule({
    contentType,
    contentId,
    title,
    scheduledAt,
    status = "scheduled",
}) {
    const operationName = "createSchedule";

    try {
        const scheduleData = {
            contentType,
            contentId,
            title: title.trim(),
            scheduledAt: normalizeScheduledAt(scheduledAt),
            status: normalizeStatus(status),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, COLLECTION), scheduleData);

        return { id: docRef.id };
    } catch (error) {
        if (!error.code) {
            throw error;
        }

        throw formatFirestoreError(error, operationName);
    }
}

export async function getSchedules() {
    const operationName = "getSchedules";

    try {
        const schedulesQuery = query(
            collection(db, COLLECTION),
            orderBy("scheduledAt", "asc"),
        );
        const snapshot = await getDocs(schedulesQuery);

        return snapshot.docs.map(mapScheduleDoc);
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}

export async function getScheduleById(id) {
    const operationName = "getScheduleById";

    try {
        const snapshot = await getDoc(doc(db, COLLECTION, id));

        if (!snapshot.exists()) {
            return null;
        }

        return mapScheduleDoc(snapshot);
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}

export async function updateSchedule(
    id,
    { contentType, contentId, title, scheduledAt, status },
) {
    const operationName = "updateSchedule";

    try {
        const updateData = {
            updatedAt: serverTimestamp(),
        };

        if (contentType !== undefined) {
            updateData.contentType = contentType;
        }

        if (contentId !== undefined) {
            updateData.contentId = contentId;
        }

        if (title !== undefined) {
            updateData.title = title.trim();
        }

        if (scheduledAt !== undefined) {
            updateData.scheduledAt = normalizeScheduledAt(scheduledAt);
        }

        if (status !== undefined) {
            updateData.status = normalizeStatus(status);
        }

        await updateDoc(doc(db, COLLECTION, id), updateData);
    } catch (error) {
        if (!error.code) {
            throw error;
        }

        throw formatFirestoreError(error, operationName);
    }
}

export async function deleteSchedule(id) {
    const operationName = "deleteSchedule";

    try {
        await deleteDoc(doc(db, COLLECTION, id));
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}
