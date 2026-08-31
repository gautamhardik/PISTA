import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07080a",
          borderRadius: "8px",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="26"
          height="26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glowing Pistachio Seed */}
          <path
            d="M 52 38 C 50 25, 66 18, 76 24 C 84 30, 80 44, 68 47 C 58 50, 53 45, 52 38 Z"
            fill="#C7F36B"
          />
          {/* Upper Shell */}
          <path
            d="M 28 65 C 24 45, 45 22, 68 18 C 76 17, 80 23, 76 28 C 65 37, 50 48, 38 56"
            stroke="#E2C98A"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Main Cursive P Body */}
          <path
            d="M 24 78 C 28 66, 33 54, 42 48 C 58 40, 82 42, 85 53 C 88 64, 68 76, 44 72 C 34 70, 26 78, 24 78 Z"
            stroke="#E2C98A"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
