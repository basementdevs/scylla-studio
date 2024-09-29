"use client";

import { Button } from "@scylla-studio/components/ui/button";
import { Input } from "@scylla-studio/components/ui/input";
import { Modal } from "@scylla-studio/components/ui/modal";
import { connection } from "@scylla-studio/lib/internal-db/connections";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Label } from "recharts";

type newConnectionErrors = {
    name?: string;
    host?: string;
    username?: string;
    password?: string;
    dc?: string;
    nodes?: string;
};


export default function NewConnectionModal({ onSave }) {
  const initialFormState: Omit<connection, 'id'> = {
    name: "",
    host: "",
    username: "",
    password: "",
    dc: "",
    nodes: 0,
  };

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<newConnectionErrors>({});

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: newConnectionErrors = {};

    if (!form.name) newErrors.name = "Name is required.";
    if (!form.host) newErrors.host = "Host is required.";
    if (!/^[a-zA-Z0-9.-]+$/.test(form.host)) newErrors.host = "Invalid host format.";
    if (!form.username) newErrors.username = "Username is required.";
    if (!form.password) newErrors.password = "Password is required.";
    if (!form.dc) newErrors.dc = "Data center (DC) is required.";
    if (form.nodes < 1) newErrors.nodes = "Nodes must be at least 1.";

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      startTransition(async () => {
        await onSave(form); 
        setForm(initialFormState); 
        setErrors({}); 
        setOpen(false);
      });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" /> New Connection
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <Label>Name/Alias</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter name or alias"
            className="mb-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <Label>Host</Label>
          <Input
            name="host"
            value={form.host}
            onChange={handleInputChange}
            placeholder="Enter host"
            className="mb-2"
          />
          {errors.host && <p className="text-red-500 text-sm">{errors.host}</p>}

          <Label>Username</Label>
          <Input
            name="username"
            value={form.username}
            onChange={handleInputChange}
            placeholder="Enter username"
            className="mb-2"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <Label>Password</Label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            className="mb-2"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <Label>DC</Label>
          <Input
            name="dc"
            value={form.dc}
            onChange={handleInputChange}
            placeholder="Enter data center"
            className="mb-2"
          />
          {errors.dc && <p className="text-red-500 text-sm">{errors.dc}</p>}

          <Label>Nodes</Label>
          <Input
            name="nodes"
            type="number"
            value={form.nodes}
            onChange={handleInputChange}
            placeholder="Enter number of nodes"
            className="mb-2"
          />
          {errors.nodes && <p className="text-red-500 text-sm">{errors.nodes}</p>}

          <Button onClick={handleSave} className="mt-4" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
