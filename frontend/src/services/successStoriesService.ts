// src/services/successStoriesService.ts
export interface SuccessStory {
  id?: number;
  customerName: string;
  location: string;
  photo: string; // Cloudinary URL
  description: string;
}

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://auto-wheel-1.onrender.com";
const API_SUCCESS_STORIES_URL = `${API_BASE_URL}/api/successstories`;

export async function getSuccessStories(): Promise<SuccessStory[]> {
  const res = await fetch(API_SUCCESS_STORIES_URL);
  if (!res.ok) throw new Error("Failed to fetch success stories");
  return res.json();
}

export async function getSuccessStory(id: number): Promise<SuccessStory> {
  const res = await fetch(`${API_SUCCESS_STORIES_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch success story");
  return res.json();
}

export async function createSuccessStory(story: Omit<SuccessStory, "id">) {
  const res = await fetch(API_SUCCESS_STORIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(story),
  });
  if (!res.ok) throw new Error("Failed to create success story");
  return res.json();
}

export async function updateSuccessStory(story: SuccessStory) {
  const res = await fetch(`${API_SUCCESS_STORIES_URL}/${story.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(story),
  });
  if (!res.ok) throw new Error("Failed to update success story");
  return res.json();
}

export async function deleteSuccessStory(id: number) {
  const res = await fetch(`${API_SUCCESS_STORIES_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete success story");
}
