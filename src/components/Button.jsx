export default function Button({ title, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color || "#E53935",
        color: "white",
        padding: "12px 20px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
      }}
    >
      {title}
    </button>
  );
}