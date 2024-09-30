"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@scylla-studio/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@scylla-studio/components/ui/form";
import { Input } from "@scylla-studio/components/ui/input";
import { Modal } from "@scylla-studio/components/ui/modal";
import { Plus } from "lucide-react";
import { ReactNode, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  host: z
    .string()
    .min(1, { message: "Host is required." })
    .regex(/^[a-zA-Z0-9.-]+$/, "Invalid host format."),
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
  dc: z.string().min(1, { message: "Data center (DC) is required." }),
  nodes: z.number().min(1, { message: "Nodes must be at least 1." }),
});

interface FormWrapperProps {
  children: ReactNode;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

function FormWrapper({ children, onSubmit }: FormWrapperProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      host: "",
      username: "",
      password: "",
      dc: "",
      nodes: 0,
    },
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      </Form>
    </FormProvider>
  );
}

export default function NewConnectionModal({ onSave }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await onSave(data);
      setOpen(false);
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" /> New Connection
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <FormWrapper onSubmit={handleSave}>
          <div className="space-y-5">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name/Alias</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name or alias" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter host" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="dc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DC</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter data center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="nodes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nodes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of nodes"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      value={field.value === "" ? "" : field.value.toString()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </FormWrapper>
      </Modal>
    </>
  );
}
