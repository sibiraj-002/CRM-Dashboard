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

function mapCategoryDoc(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name,
    slug: data.slug,
    createdAt: data.createdAt?.toDate?.() ?? null,
  };
}

export async function createCategory({ name, slug }) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: name.trim(),
    slug: (slug?.trim() || generateSlug(name)).toLowerCase(),
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id };
}

export async function getCategories() {
  const categoriesQuery = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(categoriesQuery);

  return snapshot.docs.map(mapCategoryDoc);
}

export async function getCategoryById(id) {
  const snapshot = await getDoc(doc(db, COLLECTION, id));

  if (!snapshot.exists()) {
    return null;
  }

  return mapCategoryDoc(snapshot);
}

export async function updateCategory(id, { name, slug }) {
  await updateDoc(doc(db, COLLECTION, id), {
    name: name.trim(),
    slug: (slug?.trim() || generateSlug(name)).toLowerCase(),
  });
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
