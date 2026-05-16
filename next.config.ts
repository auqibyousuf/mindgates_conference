import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
  // @ts-expect-error: Cloudflare dev initialization module
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}

