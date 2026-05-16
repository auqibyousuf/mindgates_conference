import { readData } from "@/lib/data-handler";
import ConferencesClient from "./ConferencesClient";

export const dynamic = 'force-dynamic';

export default async function ConferencesPage() {
  const conferences = await readData('conferences.json') || [];
  
  return <ConferencesClient conferences={conferences} />;
}
