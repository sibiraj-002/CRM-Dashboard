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

const COLLECTION = "categories";

function formatFirestoreError(error, operation) {
  const errorCode = error.code || "unknown_error";
  const errorMessage = error.message || "Unknown error occurred";

  const readableMessages = {
    "permission-denied": "Permission denied. Check Firestore security rules.",
    "not-found": "Category not found.",
    "already-exists": "Category already exists.",
    unauthenticated: "User must be authenticated to perform this operation.",
    "invalid-argument": "Invalid category data provided.",
    "resource-exhausted": "Resource limit exceeded.",
    "failed-precondition": "Operation failed due to precondition.",
    unavailable: "Firestore service temporarily unavailable.",
    unknown_error: "An unknown error occurred while accessing Firestore.",
  };

  const message = readableMessages[errorCode] || errorMessage;
  return new Error(`${operation}: ${message} [Code: ${errorCode}]`);
}

function mapCategoryDoc(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    slug: data.slug,
    createdAt: data.createdAt?.toDate?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  };
}

export async function createCategory({ name, slug }) {
  const operationName = "createCategory";

  try {
    const categoryData = {
      name: name.trim(),
      slug: (slug?.trim() || generateSlug(name)).toLowerCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION), categoryData);

    return { id: docRef.id };
  } catch (error) {
    throw formatFirestoreError(error, operationName);
  }
}

export async function getCategories() {
  const operationName = "getCategories";

  try {
    const categoriesQuery = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(categoriesQuery);

    return snapshot.docs.map(mapCategoryDoc);
  } catch (error) {
    throw formatFirestoreError(error, operationName);
  }
}

export async function getCategoryById(id) {
  const operationName = "getCategoryById";

  try {
    const snapshot = await getDoc(doc(db, COLLECTION, id));

    if (!snapshot.exists()) {
      return null;
    }

    return mapCategoryDoc(snapshot);
  } catch (error) {
    throw formatFirestoreError(error, operationName);
  }
}

export async function updateCategory(id, { name, slug }) {
  const operationName = "updateCategory";

  try {
    const updateData = {
      updatedAt: serverTimestamp(),
    };

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (slug !== undefined) {
      updateData.slug = slug.trim().toLowerCase();
    } else if (name !== undefined) {
      updateData.slug = generateSlug(name).toLowerCase();
    }

    await updateDoc(doc(db, COLLECTION, id), updateData);
  } catch (error) {
    throw formatFirestoreError(error, operationName);
  }
}

export async function deleteCategory(id) {
  const operationName = "deleteCategory";

  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    throw formatFirestoreError(error, operationName);
  }
}
