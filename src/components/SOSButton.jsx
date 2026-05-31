export default function SOSButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        backgroundColor: "#E53935",
        color: "white",
        border: "none",
        fontSize: "32px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0px 0px 20px rgba(229,57,53,0.5)",
      }}
    >
      SOS
    </button>
  );
}