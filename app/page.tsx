import { Metadata, ResolvingMetadata } from "next";
import { getFrameMetadata } from "@coinbase/onchainkit";

// Step 2. Use generateFrameNextMetadata to shape your Frame metadata
const frameMetadata = getFrameMetadata({
  buttons: ["test"],
  image: `${process.env["HOST"]}/api/eth`,
  post_url: `${process.env["HOST"]}/api/eth`,
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ETH Price",
    openGraph: {
      title: "ETH Price",
      images: [`/api/eth`],
    },
    other: {
      ...frameMetadata,
    },
    metadataBase: new URL(process.env["HOST"] || ""),
  };
}

export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-lg sm:text-2xl font-bold mb-2">Paste the link into a Cast to use this frame.</h1>
      </main>
    </div>
  );
}
