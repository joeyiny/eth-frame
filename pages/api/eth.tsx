import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { Poll } from "@/app/types";
import { kv } from "@vercel/kv";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";

const fontPath = join(process.cwd(), "Roboto-Regular.ttf");
let fontData = fs.readFileSync(fontPath);

function getCurrentDateTime() {
  const now = new Date();

  // Build the formatted date string manually
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = now.getFullYear();
  const month = monthNames[now.getMonth()];
  const date = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours() % 12 || 12; // Convert to 12-hour format and adjust 0 to 12
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";

  return `${month} ${date} ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
    const data = await response.json();
    const p = data.USD;
    // if (!data) return res.status(400).send("couldnt get eth price");
    const currentDateTime = getCurrentDateTime();
    const svg = await satori(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#f1f1f1",
          padding: 50,
          lineHeight: 1.2,
          fontSize: 24,
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "center",
            width: "100%",
            padding: 20,
          }}>
          <span style={{ color: "darkgray", fontSize: "30" }}>{currentDateTime}</span>
          <h2 style={{ textAlign: "center", color: "black", fontSize: "40" }}>$ETH Price</h2>
          <div
            style={{
              color: "#000",
              padding: 10,
              marginBottom: 10,
              borderRadius: 4,
              fontSize: "90",
              width: "100%",
              whiteSpace: "nowrap",
              display: "flex",
              justifyContent: "center",
              overflow: "visible",
            }}>
            ${data.USD}
          </div>
          {/*{showResults ? <h3 style={{color: "darkgray"}}>Total votes: {totalVotes}</h3> : ''}*/}
        </div>
      </div>,
      {
        width: 600,
        height: 400,
        fonts: [
          {
            data: fontData,
            name: "Roboto",
            style: "normal",
            weight: 400,
          },
        ],
      }
    );

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    // Set the content type to PNG and send the response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=10");
    res.send(pngBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
}
