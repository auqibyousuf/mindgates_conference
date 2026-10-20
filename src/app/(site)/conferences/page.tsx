import { readData } from "@/lib/data-handler";
import { Conference, SiteConfig } from "@/lib/types";
import siteConfigDefault from "@/data/siteConfig.json";
import ConferencesClient from "./ConferencesClient";

export const dynamic = 'force-dynamic';

export default async function ConferencesPage() {
  const conferences = (await readData('conferences.json') as Conference[]) || [];
  const siteConfig = (await readData('siteConfig.json') as SiteConfig) || siteConfigDefault;
  
  return <ConferencesClient conferences={conferences} siteConfig={siteConfig} />;
}
