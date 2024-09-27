import { cookiesClient } from "@/lib/server";
import DashboardContent from "./dashboard-content";
import { Note } from "@/lib/data";

export default async function DashboardPage() {
  const notes = await cookiesClient.models.Notes.list();
  return <DashboardContent notes={notes.data ?? []} />;
}
