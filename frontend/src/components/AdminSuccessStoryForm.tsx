import React, { useState } from "react";

interface SuccessStoryFormProps {
  onAdd: (story: {
    customerName: string;
    location: string;
    photo: File | null;
    description: string;
  }) => void;
}

const AdminSuccessStoryForm: React.FC<SuccessStoryFormProps> = ({ onAdd }) => {
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert("Please upload a photo of the customer with the car.");
      return;
    }
  onAdd({ customerName, location, photo, description });
  setCustomerName("");
  setLocation("");
  setPhoto(null);
  setDescription("");
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold mb-4">Add Customer Success Story</h3>
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
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Add Story</button>
    </form>
  );
};

export default AdminSuccessStoryForm;
