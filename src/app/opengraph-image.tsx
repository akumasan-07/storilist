import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "StoriList — Unified Media Tracking";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  let lettermarkDataUrl = "";
  try {
    const lettermarkBuffer = await readFile(
      join(process.cwd(), "public/lettermark.png")
    );
    lettermarkDataUrl = `data:image/png;base64,${lettermarkBuffer.toString("base64")}`;
  } catch {
    // Fallback if lettermark file is unavailable
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #090d16 0%, #111827 50%, #0b1329 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Subtle decorative glow ring */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Content Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          {lettermarkDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lettermarkDataUrl}
              alt="StoriList Lettermark"
              width={140}
              height={140}
              style={{
                borderRadius: "28px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
            />
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
        >
          <span style={{ color: "#ffffff" }}>Stori</span>
          <span style={{ color: "#0ea5e9" }}>List</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            marginBottom: "32px",
          }}
        >
          Track anime, comics, movies, series, and novels in one unified personal library.
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {["Anime", "Comics", "Movies", "Series", "Novels"].map((medium) => (
            <div
              key={medium}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: 18,
                fontWeight: 600,
                color: "#cbd5e1",
              }}
            >
              {medium}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
