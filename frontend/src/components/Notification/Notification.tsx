import React from 'react';
import styles from './Notification.module.scss';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;