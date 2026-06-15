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
import { auth } from "@/lib/firebase";
import { generateSlug } from "@/lib/utils/slug";

const COLLECTION = "blogs";

// Utility function to format Firestore errors with readable messages
function formatFirestoreError(error, operation) {
    const errorCode = error.code || "unknown_error";
    const errorMessage = error.message || "Unknown error occurred";

    const readableMessages = {
        "permission-denied": "Permission denied. Check Firestore security rules.",
        "not-found": "Resource not found.",
        "already-exists": "Resource already exists.",
        "unauthenticated": "User must be authenticated to perform this operation.",
        "invalid-argument": "Invalid arguments provided to Firestore.",
        "resource-exhausted": "Resource limit exceeded.",
        "failed-precondition": "Operation failed due to precondition.",
        "unavailable": "Firestore service temporarily unavailable.",
        "unknown_error": "An unknown error occurred while accessing Firestore.",
    };

    const message = readableMessages[errorCode] || errorMessage;
    return new Error(`${operation}: ${message} [Code: ${errorCode}]`);
}

function mapBlogDoc(snapshot) {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        title: data.title,
        slug: data.slug,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        status: data.status,
        publishDate: data.publishDate,
        publishTime: data.publishTime,
        scheduleDate: data.scheduleDate,
        scheduleTime: data.scheduleTime,
        author: data.author,
        media: data.media,
        authorId: data.authorId,
        createdAt: data.createdAt?.toDate?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.() ?? null,
    };
}

export async function createBlog({
    title,
    slug,
    metaTitle,
    metaDescription,
    excerpt,
    content,
    categoryId,
    status,
    publishDate,
    publishTime,
    scheduleDate,
    scheduleTime,
    author,
    media,
    authorId,
}) {
    const operationName = "createBlog";
    console.log(`[${operationName}] Starting blog creation`);
    console.log(`[${operationName}] Author ID:`, authorId);
    console.log(`[${operationName}] Current user:`, auth.currentUser?.uid || "None");

    try {
        const blogData = {
            title: title.trim(),
            slug: (slug?.trim() || generateSlug(title)).toLowerCase(),
            metaTitle: metaTitle?.trim() || "",
            metaDescription: metaDescription?.trim() || "",
            excerpt: excerpt.trim(),
            content: content.trim(),
            categoryId,
            status: status || "draft",
            publishDate: publishDate || "",
            publishTime: publishTime || "",
            scheduleDate: scheduleDate || "",
            scheduleTime: scheduleTime || "",
            author: author?.trim() || "",
            media: media || {},
            authorId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        console.log(`[${operationName}] Blog data to be created:`, {
            ...blogData,
            createdAt: "[serverTimestamp]",
            updatedAt: "[serverTimestamp]",
        });

        const collectionRef = collection(db, COLLECTION);
        console.log(`[${operationName}] Collection reference created for: ${COLLECTION}`);

        const docRef = await addDoc(collectionRef, blogData);
        console.log(`[${operationName}] Document created successfully with ID:`, docRef.id);

        return { id: docRef.id };
    } catch (error) {
        console.error(`[${operationName}] Error occurred:`, error);
        console.error(`[${operationName}] Error code:`, error.code);
        console.error(`[${operationName}] Error message:`, error.message);
        console.error(`[${operationName}] Full error:`, error);

        throw formatFirestoreError(error, operationName);
    }
}

export async function getBlogs() {
    const operationName = "getBlogs";
    console.log(`[${operationName}] Starting blogs retrieval`);
    console.log(`[${operationName}] Current user:`, auth.currentUser?.uid || "None");

    try {
        const collectionRef = collection(db, COLLECTION);
        console.log(`[${operationName}] Collection reference created for: ${COLLECTION}`);

        const blogsQuery = query(collectionRef, orderBy("createdAt", "desc"));
        console.log(`[${operationName}] Query constructed with orderBy createdAt desc`);

        const snapshot = await getDocs(blogsQuery);
        console.log(`[${operationName}] Query executed successfully`);
        console.log(`[${operationName}] Total documents retrieved:`, snapshot.docs.length);

        const blogs = snapshot.docs.map(mapBlogDoc);
        console.log(`[${operationName}] Successfully mapped ${blogs.length} blog documents`);

        return blogs;
    } catch (error) {
        console.error(`[${operationName}] Error occurred:`, error);
        console.error(`[${operationName}] Error code:`, error.code);
        console.error(`[${operationName}] Error message:`, error.message);

        throw formatFirestoreError(error, operationName);
    }
}

export async function getBlogById(id) {
    const operationName = "getBlogById";
    console.log(`[${operationName}] Starting blog retrieval for ID:`, id);
    console.log(`[${operationName}] Current user:`, auth.currentUser?.uid || "None");

    try {
        const docRef = doc(db, COLLECTION, id);
        console.log(`[${operationName}] Document reference created for path: ${COLLECTION}/${id}`);

        const snapshot = await getDoc(docRef);
        console.log(`[${operationName}] Document fetch completed`);
        console.log(`[${operationName}] Document exists:`, snapshot.exists());

        if (!snapshot.exists()) {
            console.log(`[${operationName}] Document does not exist`);
            return null;
        }

        const blog = mapBlogDoc(snapshot);
        console.log(`[${operationName}] Successfully mapped blog document`);

        return blog;
    } catch (error) {
        console.error(`[${operationName}] Error occurred:`, error);
        console.error(`[${operationName}] Error code:`, error.code);
        console.error(`[${operationName}] Error message:`, error.message);

        throw formatFirestoreError(error, operationName);
    }
}

export async function updateBlog(
    id,
    {
        title,
        slug,
        metaTitle,
        metaDescription,
        excerpt,
        content,
        categoryId,
        status,
        publishDate,
        publishTime,
        scheduleDate,
        scheduleTime,
        author,
        media,
    },
) {
    const operationName = "updateBlog";
    console.log(`[${operationName}] Starting blog update for ID:`, id);
    console.log(`[${operationName}] Current user:`, auth.currentUser?.uid || "None");

    try {
        const updateData = {};

        if (title !== undefined) {
            updateData.title = title.trim();
        }

        if (slug !== undefined) {
            updateData.slug = slug.trim().toLowerCase();
        } else if (title !== undefined) {
            updateData.slug = generateSlug(title).toLowerCase();
        }

        if (metaTitle !== undefined) {
            updateData.metaTitle = metaTitle.trim();
        }

        if (metaDescription !== undefined) {
            updateData.metaDescription = metaDescription.trim();
        }

        if (excerpt !== undefined) {
            updateData.excerpt = excerpt.trim();
        }

        if (content !== undefined) {
            updateData.content = content.trim();
        }

        if (categoryId !== undefined) {
            updateData.categoryId = categoryId;
        }

        if (status !== undefined) {
            updateData.status = status;
        }

        if (publishDate !== undefined) {
            updateData.publishDate = publishDate;
        }

        if (publishTime !== undefined) {
            updateData.publishTime = publishTime;
        }

        if (scheduleDate !== undefined) {
            updateData.scheduleDate = scheduleDate;
        }

        if (scheduleTime !== undefined) {
            updateData.scheduleTime = scheduleTime;
        }

        if (author !== undefined) {
            updateData.author = author.trim();
        }

        if (media !== undefined) {
            updateData.media = media || {};
        }

        updateData.updatedAt = serverTimestamp();

        console.log(`[${operationName}] Update data:`, {
            ...updateData,
            updatedAt: "[serverTimestamp]",
        });

        const docRef = doc(db, COLLECTION, id);
        console.log(`[${operationName}] Document reference created for path: ${COLLECTION}/${id}`);

        await updateDoc(docRef, updateData);
        console.log(`[${operationName}] Document updated successfully`);
    } catch (error) {
        console.error(`[${operationName}] Error occurred:`, error);
        console.error(`[${operationName}] Error code:`, error.code);
        console.error(`[${operationName}] Error message:`, error.message);

        throw formatFirestoreError(error, operationName);
    }
}

export async function deleteBlog(id) {
    const operationName = "deleteBlog";
    console.log(`[${operationName}] Starting blog deletion for ID:`, id);
    console.log(`[${operationName}] Current user:`, auth.currentUser?.uid || "None");

    try {
        const docRef = doc(db, COLLECTION, id);
        console.log(`[${operationName}] Document reference created for path: ${COLLECTION}/${id}`);

        await deleteDoc(docRef);
        console.log(`[${operationName}] Document deleted successfully`);
    } catch (error) {
        console.error(`[${operationName}] Error occurred:`, error);
        console.error(`[${operationName}] Error code:`, error.code);
        console.error(`[${operationName}] Error message:`, error.message);

        throw formatFirestoreError(error, operationName);
    }
}

// TEST FUNCTION - Verify Firestore permissions and authentication
export async function testFirestoreConnection() {
    console.log("\n=== FIRESTORE CONNECTION TEST ===\n");

    const testResults = {
        timestamp: new Date().toISOString(),
        currentUser: null,
        isAuthenticated: false,
        canReadCollection: false,
        errorDetails: null,
    };

    try {
        // Check authentication status
        const user = auth.currentUser;
        console.log("1. Checking authentication status...");
        if (user) {
            console.log("✓ User authenticated:");
            console.log(`  - UID: ${user.uid}`);
            console.log(`  - Email: ${user.email}`);
            console.log(`  - Display Name: ${user.displayName || "Not set"}`);
            testResults.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            };
            testResults.isAuthenticated = true;
        } else {
            console.log("✗ No user authenticated");
            testResults.errorDetails =
                "No authenticated user. Please log in first.";
        }

        // Test reading the blogs collection
        console.log("\n2. Attempting to read blogs collection...");
        try {
            const collectionRef = collection(db, COLLECTION);
            const testQuery = query(collectionRef);

            console.log(`  - Collection: ${COLLECTION}`);
            console.log("  - Executing getDocs query...");

            const snapshot = await getDocs(testQuery);

            console.log(
                `✓ Successfully read ${snapshot.docs.length} documents from '${COLLECTION}' collection`
            );
            testResults.canReadCollection = true;
        } catch (readError) {
            console.log("✗ Failed to read collection:");
            console.log(`  - Error Code: ${readError.code}`);
            console.log(`  - Error Message: ${readError.message}`);
            testResults.canReadCollection = false;
            testResults.errorDetails = {
                code: readError.code,
                message: readError.message,
            };
        }

        console.log("\n=== TEST RESULTS ===");
        console.log(JSON.stringify(testResults, null, 2));
        console.log("\n=== END TEST ===\n");

        return testResults;
    } catch (error) {
        console.error("Unexpected error during test:", error);
        testResults.errorDetails = error.message;
        return testResults;
    }
}
