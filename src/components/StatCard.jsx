export default function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <h4>{title}</h4>

      <h2>{value}</h2>
    </div>
  );
}