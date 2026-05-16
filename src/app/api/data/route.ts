import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();
    
    let filePath = "";
    switch (type) {
      case "conferences":
        filePath = path.join(process.cwd(), "src/data/conferences.json");
        break;
      case "books":
        filePath = path.join(process.cwd(), "src/data/books.json");
        break;
      case "awards":
        filePath = path.join(process.cwd(), "src/data/awards.json");
        break;
      case "siteConfig":
        filePath = path.join(process.cwd(), "src/data/siteConfig.json");
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update data:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}
