import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../common/Button.jsx';

export const OverdueBanner = ({ count }) => {
  const [visible, setVisible] = useState(true);
  if (!visible || count <= 0) return null;

  return (
    <div className="overdue-banner">
      <AlertTriangle size={20} />
      <span>{count} task{count === 1 ? '' : 's'} overdue. Prioritize them before the queue gets noisy.</span>
      <Button variant="ghost" size="icon" onClick={() => setVisible(false)} aria-label="Dismiss overdue banner">
        <X size={16} />
      </Button>
    </div>
  );
};
