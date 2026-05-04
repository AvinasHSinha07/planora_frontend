import CategoriesSection from "./CategoriesSection";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 86400 }, // Cache categories for 24 hours
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function CategoriesWrapper() {
  const categories = await getCategories();
  return <CategoriesSection initialData={categories} />;
}
