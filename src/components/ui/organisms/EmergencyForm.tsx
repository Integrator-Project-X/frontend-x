"use client"

import { useState } from "react";

type EmergencyFormProps = {
  onSubmit?: (data: { type: string; location: string; description?: string; name?: string; phone?: string }) => Promise<void> | void;
  submitLabel?: string;
};

const EmergencyForm = ({ onSubmit, submitLabel = "Send Report to Animal Patrol" }: EmergencyFormProps) => {
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enviar el reporte a Animal Patrol
    if (onSubmit) {
      await onSubmit({
        type: formData.type,
        location: formData.location,
        description: formData.description,
        name: formData.name,
        phone: formData.phone,
      });
    } else {
      console.log(formData);
      alert("Report sent (demo)");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Type of Case:</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Select the type of emergency"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Street address or neighborhood"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Brief Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Describe what is happening with the animal"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Attach Photos (Optional):</label>
        <input type="file" name="photos" className="w-full p-2 mt-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Your Contact Information:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Your name"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Your phone number"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-4 text-white bg-blue-600 rounded"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default EmergencyForm;
