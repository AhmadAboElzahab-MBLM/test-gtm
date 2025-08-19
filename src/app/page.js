export default function page() {
  return (
    <div>
      <button
        onClick={() => sendGTMEvent({ event: "ahmad", value: "ahmadClicked" })}
      >
        Send Event
      </button>
    </div>
  );
}
