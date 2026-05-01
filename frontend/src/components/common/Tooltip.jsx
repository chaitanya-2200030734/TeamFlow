export const Tooltip = ({ label, children }) => (
  <span className="tooltip" data-tooltip={label}>
    {children}
  </span>
);
