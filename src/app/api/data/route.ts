import { NextResponse } from "next/server";
import { writeData } from "@/lib/data-handler";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();
    
    let filename = "";
    switch (type) {
      case "conferences":
        filename = "conferences.json";
        break;
      case "books":
        filename = "books.json";
        break;
      case "awards":
        filename = "awards.json";
        break;
      case "siteConfig":
        filename = "siteConfig.json";
        break;
      case "editors":
        filename = "editors.json";
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await writeData(filename, data);
    
    if (result.success) {
      return NextResponse.json({ success: true, storage: result.storage });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to update data:", error);
    return NextResponse.json({ 
      error: "Failed to update data",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
