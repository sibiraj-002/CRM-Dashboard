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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "media";

function formatFirestoreError(error, operation) {
    const errorCode = error.code || "unknown_error";
    const errorMessage = error.message || "Unknown error occurred";

    const readableMessages = {
        "permission-denied": "Permission denied. Check Firestore security rules.",
        "not-found": "Media not found.",
        "already-exists": "Media already exists.",
        unauthenticated: "User must be authenticated to perform this operation.",
        "invalid-argument": "Invalid media data provided.",
        "resource-exhausted": "Resource limit exceeded.",
        "failed-precondition": "Operation failed due to precondition.",
        unavailable: "Firestore service temporarily unavailable.",
        unknown_error: "An unknown error occurred while accessing Firestore.",
    };

    const message = readableMessages[errorCode] || errorMessage;
    return new Error(`${operation}: ${message} [Code: ${errorCode}]`);
}

function mapMediaDoc(snapshot) {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt?.toDate?.() ?? null,
    };
}

function getFileNameFromUrl(fileUrl) {
    try {
        const url = new URL(fileUrl);
        const fileName = url.pathname.split("/").filter(Boolean).pop();
        return fileName || "media-file";
    } catch {
        return "media-file";
    }
}

function getFileTypeFromUrl(fileUrl) {
    const extension = getFileNameFromUrl(fileUrl).split(".").pop()?.toLowerCase();

    const fileTypes = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        svg: "image/svg+xml",
        mp4: "video/mp4",
        mp3: "audio/mpeg",
        pdf: "application/pdf",
    };

    return fileTypes[extension] || "application/octet-stream";
}

export async function uploadMedia({
    fileName,
    fileUrl,
    fileType,
    fileSize = 0,
    uploadedBy,
}) {
    const operationName = "uploadMedia";

    try {
        if (!fileUrl?.trim()) {
            throw new Error("fileUrl is required for mock media uploads");
        }

        const mediaData = {
            fileName: fileName?.trim() || getFileNameFromUrl(fileUrl),
            fileUrl: fileUrl.trim(),
            fileType: fileType?.trim() || getFileTypeFromUrl(fileUrl),
            fileSize: Number(fileSize) || 0,
            uploadedBy: uploadedBy || "",
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, COLLECTION), mediaData);

        return { id: docRef.id };
    } catch (error) {
        if (!error.code) {
            throw error;
        }

        throw formatFirestoreError(error, operationName);
    }
}

export async function getMedia() {
    const operationName = "getMedia";

    try {
        const mediaQuery = query(
            collection(db, COLLECTION),
            orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(mediaQuery);

        return snapshot.docs.map(mapMediaDoc);
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}

export async function getMediaById(id) {
    const operationName = "getMediaById";

    try {
        const snapshot = await getDoc(doc(db, COLLECTION, id));

        if (!snapshot.exists()) {
            return null;
        }

        return mapMediaDoc(snapshot);
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}

export async function deleteMedia(id) {
    const operationName = "deleteMedia";

    try {
        await deleteDoc(doc(db, COLLECTION, id));
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}
