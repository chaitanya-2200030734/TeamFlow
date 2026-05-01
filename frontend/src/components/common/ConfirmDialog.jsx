import { AlertTriangle } from 'lucide-react';
import { Button } from './Button.jsx';
import { Modal } from './Modal.jsx';

export const ConfirmDialog = ({ open, title = 'Are you sure?', message, onConfirm, onCancel, loading }) => (
  <Modal open={open} title={title} onClose={onCancel}>
    <div className="confirm-body">
      <AlertTriangle />
      <p>{message}</p>
    </div>
    <div className="modal-actions">
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button variant="danger" disabled={loading} onClick={onConfirm}>Confirm</Button>
    </div>
  </Modal>
);
