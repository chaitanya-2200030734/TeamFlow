export const StatsCard = ({ icon: Icon, label, value, tone = 'primary' }) => (
  <article className={`stats-card stats-${tone}`}>
    <div className="stats-icon">{Icon && <Icon size={20} />}</div>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  </article>
);
