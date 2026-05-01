export const Spinner = ({ label = 'Loading' }) => (
  <div className="spinner-wrap" role="status" aria-label={label}>
    <span className="spinner" />
    <span>{label}</span>
  </div>
);
