"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { client, Note } from "@/lib/data";
import { uploadData, getUrl } from "aws-amplify/storage";
import { getS3Path } from "@/lib/utils";

export default function NoteContent({ note }: { note: Note }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (note.image) {
        const url = (await getUrl({ path: note.image })).url.toString();
        setImageUrl(url);
      }
    };
    fetchImageUrl();
  }, [note.image]);

  const handleSave = async () => {
    // In a real app, you would send this data to your backend
    let uploadUrl: string | null = null;
    try {
      if (image) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const upload = uploadData({
          data: buffer,
          path: getS3Path(image.name),
        });

        uploadUrl = (await upload.result).path;
      }

      await client.models.Notes.update({
        id: note.id,
        title,
        description,
        image: image ? uploadUrl : note.image,
      });
      setIsEditing(false);
      toast({
        title: "Note updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscard = () => {
    setTitle(note.title);
    setDescription(note.description);
    setImage(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    // In a real app, you would send a delete request to your backend
    try {
      await client.models.Notes.delete({ id: note.id });
      toast({
        title: "Note deleted",
        description: "The note has been permanently removed.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
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
                <>
                  <Button variant="destructive" onClick={handleDiscard}>
                    <X className="mr-2 h-4 w-4" /> Discard changes
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
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
                          This action cannot be undone. This will permanently
                          delete your note.
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
                </>
              )}
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
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded image"
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-64">
                {note.image && imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Note image"
                    className="object-cover rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
