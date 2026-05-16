import { readData } from "@/lib/data-handler";
import { Conference } from "@/lib/types";
import ConferencesClient from "./ConferencesClient";

export const dynamic = 'force-dynamic';

export default async function ConferencesPage() {
  const conferences = (await readData('conferences.json') as Conference[]) || [];
  
  return <ConferencesClient conferences={conferences} />;
}
