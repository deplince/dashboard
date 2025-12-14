"use client";

import { useEffect, useState } from "react";
import {
  getAllRecords,
  createRecord,
  deleteRecord,
  getOneRecord,
} from "@/app/libs/api/record";
import { RecordCardInterface } from "@/app/libs/data";

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordCardInterface[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const loadRecords = () => {
    getAllRecords({ page: 1, limit: 100 }).then((res) => setRecords(res.data));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRecord({ title, content });
    setTitle("");
    setContent("");
    loadRecords();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this record?")) {
      await deleteRecord(id);
      loadRecords();
    }
  };

  const handleView = async (id: string) => {
    try {
      const record = await getOneRecord(id);
      alert(
        `Fetched Record:\n\nTitle: ${record.title}\nContent: ${record.content}\nID: ${record.id}`,
      );
    } catch (error) {
      alert("Failed to fetch record");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-black">New Record</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="rounded border p-2 text-black"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="rounded border p-2 text-black"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button className="self-start rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Add Record
            </button>
          </form>
        </div>

        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record.id} className="rounded-lg bg-white p-6 shadow">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {record.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(record.id)}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{record.content}</p>
              <div className="mt-4 text-xs text-gray-400">
                Created by: {record.user?.first_name} on{" "}
                {new Date(record.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
