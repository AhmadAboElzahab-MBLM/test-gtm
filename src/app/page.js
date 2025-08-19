export default function page() {
  return (
    <div>
      <button
        onClick={() => {
          console.log("clicked");
          sendGTMEvent({ event: "ahmad", value: "ahmadClicked" });
        }}
      >
        Send Event
      </button>
    </div>
  );
}
