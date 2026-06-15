import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

const dashboardCollections = {
    blogs: "blogs",
    articles: "articles",
    news: "news",
    podcasts: "podcasts",
    categories: "categories",
    media: "media",
    scheduledPosts: "scheduledPosts",
    users: "users",
};

function formatFirestoreError(error, operation) {
    const errorCode = error.code || "unknown_error";
    const errorMessage = error.message || "Unknown error occurred";

    const readableMessages = {
        "permission-denied": "Permission denied. Check Firestore security rules.",
        unauthenticated: "User must be authenticated to perform this operation.",
        "invalid-argument": "Invalid dashboard query provided.",
        "resource-exhausted": "Resource limit exceeded.",
        "failed-precondition": "Operation failed due to precondition.",
        unavailable: "Firestore service temporarily unavailable.",
        unknown_error: "An unknown error occurred while accessing Firestore.",
    };

    const message = readableMessages[errorCode] || errorMessage;
    return new Error(`${operation}: ${message} [Code: ${errorCode}]`);
}

async function getCollectionCount(collectionName) {
    const snapshot = await getCountFromServer(collection(db, collectionName));
    return snapshot.data().count;
}

export async function getDashboardCounts() {
    const operationName = "getDashboardCounts";

    try {
        const entries = await Promise.all(
            Object.entries(dashboardCollections).map(async ([key, collectionName]) => [
                key,
                await getCollectionCount(collectionName),
            ]),
        );

        return Object.fromEntries(entries);
    } catch (error) {
        throw formatFirestoreError(error, operationName);
    }
}
