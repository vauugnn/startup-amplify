import { cookiesClient } from "@/lib/server";
import NoteContent from "./note-content";
import { getUrl } from "aws-amplify/storage";

export default async function NotePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const note = await cookiesClient.models.Notes.get({ id });

  if (!note.data) {
    return <div>Note not found</div>;
  }

  return <NoteContent note={note.data} />;
}
