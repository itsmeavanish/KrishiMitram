import React, { useState, ChangeEvent, FormEvent } from "react";

interface StockedCropFormProps {
  farmerId: string;
}

interface FormData {
  cropName: string;
  amount: string;
  price: string;
  contactOfFarmer: string;
}

const StockedCropForm: React.FC<StockedCropFormProps> = ({ farmerId }) => {
  const [form, setForm] = useState<FormData>({
    cropName: "",
    amount: "",
    price: "",
    contactOfFarmer: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/crop/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, farmerId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Crop registered successfully!");
        setForm({
          cropName: "",
          amount: "",
          price: "",
          contactOfFarmer: "",
        });
      } else {
        setMessage(`❌ Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Register Stocked Crop
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Crop Name */}
        <input
          type="text"
          name="cropName"
          placeholder="Crop Name (e.g. Wheat, Rice)"
          value={form.cropName}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount (kg)"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Total Price (INR)"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />

        {/* Contact */}
        <input
          type="text"
          name="contactOfFarmer"
          placeholder="Contact Number"
          value={form.contactOfFarmer}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Registering..." : "Register Crop"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default StockedCropForm;
