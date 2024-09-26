"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, Pencil, Save, Trash2, Upload, X } from "lucide-react";

// Mock data for a single note
const mockNote = {
  id: 1,
  title: "Meeting Notes",
  description:
    "Discussed project timeline and deliverables for Q3. Action items include setting up weekly check-ins and defining KPIs. Team agreed on using Agile methodology for the upcoming sprint. Sarah will be the Scrum Master for this project. Next meeting scheduled for Friday to review the initial backlog.",
  imageUrl: "/placeholder.svg",
  createdAt: "2023-06-15T10:00:00Z",
};

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState(mockNote);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [image, setImage] = useState<File | null>(null);

  const handleSave = () => {
    // In a real app, you would send this data to your backend
    setNote({ ...note, title, description });
    setIsEditing(false);
    toast({
      title: "Note updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleDelete = () => {
    // In a real app, you would send a delete request to your backend
    toast({
      title: "Note deleted",
      description: "The note has been permanently removed.",
    });
    router.push("/dashboard");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="link"
              className="text-gray-400"
              onClick={() => router.push("/dashboard")}
            >
              <ChevronLeft /> Back
            </Button>
            <div className="flex flex-wrap gap-2 space-x-2">
              {isEditing ? (
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
              <Button variant="destructive" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" /> Discard changes
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <h1 className="text-3xl w-full font-bold text-gray-900">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold"
              />
            ) : (
              note.title
            )}
          </h1>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Created on: {new Date(note.createdAt).toLocaleString()}
            </p>
            {isEditing ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-40"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {note.description}
              </p>
            )}
          </div>
          <div className="mb-6">
            <Label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Note Image
            </Label>
            {isEditing ? (
              <div className="flex items-center space-x-4">
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Label htmlFor="image" className="cursor-pointer">
                  <div className="flex items-center justify-center w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                </Label>
                {image && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Uploaded image"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-64">
                <Image
                  src={note.imageUrl}
                  alt="Note image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
