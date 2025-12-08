// app/admin/retreats/retreat-form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RetreatForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Build payload in the shape the API accepts.
      // We prefer sending 'basePrice' because your frontend used that.
      const payload = {
        name,
        location,
        description,
        basePrice, // keep as string; backend will coerce
        images: [], // send an empty array if you don't manage images yet
        dates: [], // send empty dates for now; backend supports this
      };

      const res = await fetch("/api/retreats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (!res.ok) {
        // show the error returned by the API if available
        console.error("Failed creating retreat:", body);
        const msg = body?.error ?? "Failed to create retreat";
        setError(typeof msg === "string" ? msg : JSON.stringify(msg));
        setLoading(false);
        return;
      }

      // success
      setLoading(false);
      // Optionally clear form
      setName("");
      setLocation("");
      setDescription("");
      setBasePrice("");
      // Refresh the page or navigate to list so the created retreat appears
      router.refresh();
      alert("Retreat saved successfully");
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(err?.message ?? "Unexpected error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">New Retreat</h3>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Base Price (€)</label>
        <input
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
          inputMode="decimal"
          placeholder="0.00"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setName("");
            setLocation("");
            setDescription("");
            setBasePrice("");
            setError(null);
          }}
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
