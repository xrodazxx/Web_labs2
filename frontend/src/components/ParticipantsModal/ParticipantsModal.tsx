import React from 'react';
import type { User } from '../../types/user';
import styles from './ParticipantsModal.module.scss';

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: User[];
  eventTitle: string;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  isOpen,
  onClose,
  participants,
  eventTitle
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Участники мероприятия: {eventTitle}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.participantsList}>
          {participants.length === 0 ? (
            <p className={styles.emptyMessage}>Участников пока нет</p>
          ) : (
            participants.map(participant => (
              <div key={participant.id} className={styles.participantItem}>
                <span className={styles.participantName}>
                  {participant?.name || 'Неизвестный пользователь'}
                </span>
                {participant?.email && (
                  <span className={styles.participantEmail}>{participant.email}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;