"use client";
import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

export default function page() {
  return (
    <div>
      <button
        onClick={() => {
          console.log("clicked");

          // GTM Event (working correctly)
          sendGTMEvent({ event: "ahmad", value: "ahmadClicked" });

          // GA Event - Correct syntax for custom event "ahmad"
          sendGAEvent("event", "ahmad", {
            value: "ahmadClicked",
          });
        }}
      >
        Send Event
      </button>
      MBLM
    </div>
  );
}
