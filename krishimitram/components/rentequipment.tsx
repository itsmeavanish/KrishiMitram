"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react"

interface GeoLocation {
  lat: number | null
  lng: number | null
}

interface EquipmentFormState {
  equipmentName: string
  type: string
  rate: string
  unit: string
  description: string
  ownerName: string
  ownerId: string
  contact: string
  geolocation: GeoLocation
}

const EquipmentForm: React.FC = () => {
  const [form, setForm] = useState<EquipmentFormState>({
    equipmentName: "",
    type: "",
    rate: "",
    unit: "per day",
    description: "",
    ownerName: "",
    ownerId: "",
    contact: "",
    geolocation: { lat: null, lng: null },
  })

  const [loading, setLoading] = useState<boolean>(false)

  // Get geolocation once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            geolocation: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          }))
        },
        (err) => console.error("Geolocation error:", err)
      )
    }
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.geolocation.lat || !form.geolocation.lng) {
      alert("Could not fetch your location. Please allow location access.")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:5000/api/equipment/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentName: form.equipmentName,
          type: form.type,
          rate: {
            amount: Number(form.rate),
            unit: form.unit,
          },
          description: form.description,
          ownerName: form.ownerName,
          ownerId: form.ownerId || "68c99bda2363389995d7dd85", // sample farmerId
          contact: form.contact,
          geolocation: form.geolocation,
        }),
      })

      if (!res.ok) throw new Error("Failed to register equipment")

      const data = await res.json()
      alert("✅ Equipment registered successfully!")
      console.log("Registered:", data)

      // Reset form (preserve geolocation)
      setForm((prev) => ({
        equipmentName: "",
        type: "",
        rate: "",
        unit: "per day",
        description: "",
        ownerName: "",
        ownerId: "",
        contact: "",
        geolocation: prev.geolocation,
      }))
    } catch (err) {
      console.error(err)
      alert("❌ Failed to register equipment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-gray-700 text-center">
        Register Equipment
      </h2>

      <input
        name="equipmentName"
        placeholder="Equipment Name"
        value={form.equipmentName}
        onChange={handleChange}
        required
        className="border p-2 rounded-md"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        className="border p-2 rounded-md"
      >
        <option value="">Select Type</option>
        <option value="Tractor">Tractor</option>
        <option value="Seeder">Seeder</option>
        <option value="Harvestor">Harvestor</option>
        <option value="Cultivator">Cultivator</option>
        <option value="Plower">Plower</option>
        <option value="Disk Harrow">Disk Harrow</option>
      </select>

      <div className="flex gap-2">
        <input
          name="rate"
          placeholder="Rate"
          type="number"
          value={form.rate}
          onChange={handleChange}
          required
          className="border p-2 rounded-md flex-1"
        />
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="border p-2 rounded-md"
        >
          <option value="per hour">Per Hour</option>
          <option value="per day">Per Day</option>
        </select>
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 rounded-md"
      />

      <input
        name="ownerName"
        placeholder="Owner Name"
        value={form.ownerName}
        onChange={handleChange}
        required
        className="border p-2 rounded-md"
      />

      <input
        name="contact"
        placeholder="Contact Number"
        value={form.contact}
        onChange={handleChange}
        required
        className="border p-2 rounded-md"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold disabled:bg-gray-400"
      >
        {loading ? "Registering..." : "Register Equipment"}
      </button>
    </form>
  )
}

export default EquipmentForm
