"use client";

import { ulid } from "ulid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Upload, X } from "lucide-react";
import { client } from "@/lib/data";

export default function CreateNoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting note:", { title, description, image });

    try {
      await client.models.Notes.create({
        id: ulid(),
        title,
        description,
      });

      toast({
        title: "Note created",
        description: "Your new note has been created successfully.",
      });

      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setImage(null);
      setIsOpen(false);

      // Navigate to the dashboard (or the newly created note)
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter note description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image" className="text-right">
              Image (optional)
            </Label>
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
                  {image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="Uploaded image"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </Label>
              {image && <p className="text-sm text-gray-500">{image.name}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
