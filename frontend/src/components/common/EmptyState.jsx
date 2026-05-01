export const EmptyState = ({ icon: Icon, title, helper }) => (
  <div className="empty-state">
    {Icon && <Icon size={32} />}
    <h3>{title}</h3>
    {helper && <p>{helper}</p>}
  </div>
);
