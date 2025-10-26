import React, { useState } from "react";

interface SuccessStoryFormProps {
  onAdd: (story: {
    customerName: string;
    location: string;
    photo: File | null;
    description: string;
  }) => void;
}

const CLOUDINARY_UPLOAD_PRESET = "auto_wheel_preset"; // Use your actual car image upload preset
const CLOUDINARY_CLOUD_NAME = "autowheel"; // Use your actual car image cloud name

const AdminSuccessStoryForm: React.FC<SuccessStoryFormProps> = () => {
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!photo) {
      setMessage("Please upload a photo of the customer with the car.");
      return;
    }
    setLoading(true);
    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryData.secure_url) {
        throw new Error("Image upload failed");
      }
      // POST story to backend
      const story = {
        customerName,
        location,
        photo: cloudinaryData.secure_url,
        description,
      };
      const apiRes = await fetch("/api/success-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
      if (!apiRes.ok) {
        throw new Error("Failed to save story");
      }
      setMessage("Success story added!");
      setCustomerName("");
      setLocation("");
      setPhoto(null);
      setDescription("");
    } catch (err: any) {
      setMessage(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold mb-4">Add Customer Success Story</h3>
      {message && (
        <div className={`mb-3 text-sm ${message.includes("Success") ? "text-green-600" : "text-red-600"}`}>{message}</div>
      )}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Location</label>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Photo (Customer & Car)</label>
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} className="w-full" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={loading}>{loading ? "Uploading..." : "Add Story"}</button>
    </form>
  );
};

export default AdminSuccessStoryForm;
