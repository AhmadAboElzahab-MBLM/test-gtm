"use client";
import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

export default function page() {
  return (
    <div>
      <button
        onClick={() => {
          console.log("clicked");
          sendGTMEvent({ event: "ahmad", value: "ahmadClicked" });
          sendGAEvent({ event: "ahmad", value: "ahmadClicked" });
        }}
      >
        Send Event
      </button>
      Test
    </div>
  );
}
