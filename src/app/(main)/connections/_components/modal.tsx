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
import { useLayout } from "@scylla-studio/contexts/layout";
import { Plus } from "lucide-react";
import { type ReactNode, useEffect, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required." }),
    host: z.string().refine((value) => {
      // Regex for matching localhost:port
      const localhostRegex = /^localhost$/;
      // Regex for matching IPv4 addresses
      const ipv4Regex =
        /^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/;
      // Regex for matching domain-style address (example: node-0.aws-sa-east-1.1695b05c8e05b5237178.clusters.scylla.cloud)
      const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/;

      return (
        localhostRegex.test(value) ||
        ipv4Regex.test(value) ||
        domainRegex.test(value)
      );
    }),
    port: z.coerce.number().min(1).max(65_545),
    username: z.string().nullable().default(null),
    password: z.string().nullable().default(null),
  })
  .required();

interface FormWrapperProperties {
  children: ReactNode;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}

function FormWrapper({
  children,
  onSubmit,
  defaultValues,
}: FormWrapperProperties) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      </Form>
    </FormProvider>
  );
}

interface NewConnectionModalProperties {
  onSave: (data: z.infer<typeof formSchema>) => Promise<void>;
  connectionToEdit?: Partial<z.infer<typeof formSchema>> | null;
}

export default function NewConnectionModal({
  onSave,
  connectionToEdit,
}: NewConnectionModalProperties) {
  const [open, setOpen] = useState(false);
  const fetchInitialConnections = useLayout(
    (state) => state.fetchInitialConnections,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (connectionToEdit) {
      setOpen(true);
    }
  }, [connectionToEdit]);

  const handleSave = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await onSave(data);
      fetchInitialConnections();
      setOpen(false);
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" /> New Connection
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <FormWrapper
          onSubmit={handleSave}
          defaultValues={connectionToEdit || undefined}
        >
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
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      type={"number"}
                      placeholder="Enter port: 9042"
                      {...field}
                    />
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

            <Button type="submit" disabled={isPending}>
              {connectionToEdit ? "Update Connection" : "Save Connection"}
            </Button>
          </div>
        </FormWrapper>
      </Modal>
    </>
  );
}
