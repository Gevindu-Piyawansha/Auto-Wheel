import React, { useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUtils";

interface SuccessStoryFormProps {
  onAdd: (story: {
    customerName: string;
    location: string;
    photo: File | null;
    description: string;
  }) => void;
}

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://auto-wheel-1.onrender.com";

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
      // Upload image to Cloudinary using utility function
      console.log("Uploading image to Cloudinary...");
      const imageUrl = await uploadToCloudinary(photo);
      console.log("Image uploaded successfully:", imageUrl);
      // POST story to backend
      const story = {
        customerName,
        location,
        photo: imageUrl,
        description,
      };
      console.log("Posting story to backend:", story);
      const apiRes = await fetch(`${API_BASE_URL}/api/successstories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
      console.log("Backend response status:", apiRes.status);
      if (!apiRes.ok) {
        const errorText = await apiRes.text();
        console.error("Backend error:", errorText);
        throw new Error(`Failed to save story: ${errorText}`);
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
    <form
      className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-bold mb-4">Add Customer Success Story</h3>
      {message && (
        <div
          className={`mb-3 text-sm ${
            message.includes("Success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Photo (Customer & Car)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Add Story"}
      </button>
    </form>
  );
};

export default AdminSuccessStoryForm;
