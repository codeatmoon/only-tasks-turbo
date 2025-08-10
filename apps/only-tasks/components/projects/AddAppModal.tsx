"use client";
import { useState } from "react";
import Modal from "../ui/Modal";

export default function AddAppModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  return (
    <Modal open={open} onClose={onClose} title="Add App">
      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="App name"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="icon-btn"
            onClick={() => {
              if (name.trim()) {
                onCreate(name.trim());
                setName("");
                onClose();
              }
            }}
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
}
