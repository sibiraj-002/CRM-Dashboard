import { EditCategoryView } from "@/components/categories";

export const metadata = {
  title: "Edit Category | Intelligence CRM",
  description: "Edit an existing content category",
};

export default async function EditCategoryPage({ params }) {
  const { id } = await params;

  return <EditCategoryView categoryId={id} />;
}
