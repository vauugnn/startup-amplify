"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  PlusCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import CreateNoteForm from "./create-note-form";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { client, Note } from "@/lib/data";
import { revalidatePath } from "next/cache";

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
};

function trimDescription(description: string, maxLength: number = 60) {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + "...";
}

export default function DashboardContent({ notes }: { notes: Note[] }) {
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleViewNote = (id: string) => {
    console.log(`View note ${id}`);
    // Implement view logic here
    router.push(`/notes/${id}`);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await client.models.Notes.delete({ id });
      toast({
        title: "Note deleted",
        description: "The note has been permanently removed.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
      });
    }
  };

  const handleLogout = async () => {
    // Implement logout logic here
    try {
      await signOut();
      router.push("/auth");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement account update logic here
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    console.log("Account updated", { name, oldPassword, newPassword });
    toast({
      title: "Account updated",
      description: "Your account has been successfully updated.",
    });
    setIsAccountDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <p className="font-bold">Acme Inc.</p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsAccountDialogOpen(true)}>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-center mb-4 line-clamp-2 font-bold text-gray-900">
          Welcome, {user.name}!
        </h1>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Notes</h2>
          <CreateNoteForm />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!notes.length && <h1 className="text-3xl font-bold">No notes.</h1>}
          {notes.map((note) => (
            <Card
              key={note.id}
              className="flex flex-col justify-between cursor-pointer"
              onClick={() => handleViewNote(note.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewNote(note.id);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View note</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete note</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-gray-600">
                  {trimDescription(note.description)}
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <p className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Update your account information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAccount}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="old-password" className="text-right">
                  Old Password
                </Label>
                <Input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
