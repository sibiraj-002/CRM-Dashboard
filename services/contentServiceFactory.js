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
import { generateSlug } from "@/lib/utils/slug";

function formatFirestoreError(error, operation, resourceName) {
    const errorCode = error.code || "unknown_error";
    const errorMessage = error.message || "Unknown error occurred";

    const readableMessages = {
        "permission-denied": "Permission denied. Check Firestore security rules.",
        "not-found": `${resourceName} not found.`,
        "already-exists": `${resourceName} already exists.`,
        unauthenticated: "User must be authenticated to perform this operation.",
        "invalid-argument": `Invalid ${resourceName.toLowerCase()} data provided.`,
        "resource-exhausted": "Resource limit exceeded.",
        "failed-precondition": "Operation failed due to precondition.",
        unavailable: "Firestore service temporarily unavailable.",
        unknown_error: "An unknown error occurred while accessing Firestore.",
    };

    const message = readableMessages[errorCode] || errorMessage;
    return new Error(`${operation}: ${message} [Code: ${errorCode}]`);
}

function mapContentDoc(snapshot) {
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

export function createContentService(collectionName, resourceName) {
    async function createItem({
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
        const operationName = `create${resourceName}`;

        try {
            const contentData = {
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

            const docRef = await addDoc(collection(db, collectionName), contentData);

            return { id: docRef.id };
        } catch (error) {
            throw formatFirestoreError(error, operationName, resourceName);
        }
    }

    async function getItems() {
        const operationName = `get${resourceName}s`;

        try {
            const contentQuery = query(
                collection(db, collectionName),
                orderBy("createdAt", "desc"),
            );
            const snapshot = await getDocs(contentQuery);

            return snapshot.docs.map(mapContentDoc);
        } catch (error) {
            throw formatFirestoreError(error, operationName, resourceName);
        }
    }

    async function getItemById(id) {
        const operationName = `get${resourceName}ById`;

        try {
            const snapshot = await getDoc(doc(db, collectionName, id));

            if (!snapshot.exists()) {
                return null;
            }

            return mapContentDoc(snapshot);
        } catch (error) {
            throw formatFirestoreError(error, operationName, resourceName);
        }
    }

    async function updateItem(
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
        const operationName = `update${resourceName}`;

        try {
            const updateData = {
                updatedAt: serverTimestamp(),
            };

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

            await updateDoc(doc(db, collectionName, id), updateData);
        } catch (error) {
            throw formatFirestoreError(error, operationName, resourceName);
        }
    }

    async function deleteItem(id) {
        const operationName = `delete${resourceName}`;

        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (error) {
            throw formatFirestoreError(error, operationName, resourceName);
        }
    }

    return {
        createItem,
        getItems,
        getItemById,
        updateItem,
        deleteItem,
    };
}
