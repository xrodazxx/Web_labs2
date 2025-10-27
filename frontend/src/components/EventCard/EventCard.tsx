import React, { useState } from 'react';
import type { Event } from '../../types/event';
import styles from './EventCard.module.scss';
import ParticipantsModal from '../ParticipantsModal/ParticipantsModal';
import { useEffect } from 'react';

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
  onEdit?: (event: Event) => void;
  onParticipate: (eventId: string) => void;
  onFetchParticipants: (eventId: string) => void;
  canEdit: boolean;
  currentUserId: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onDelete, 
  onEdit, 
  onParticipate, 
  onFetchParticipants,
  canEdit, 
  currentUserId 
}) => {
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);


  useEffect(() => {
    if (event.participants === undefined) {
      onFetchParticipants(event.id);
    }
  }, [event.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      onDelete(event.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
    }
  };

  const handleParticipate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onParticipate(event.id);
  };

  const handleParticipantsClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.participants && event.participants.length > 0) {
      setIsLoadingParticipants(true);
      try {
        await onFetchParticipants(event.id);
        setIsParticipantsModalOpen(true);
      } catch (error) {
        console.error('Error loading participants:', error);
      } finally {
        setIsLoadingParticipants(false);
      }
    }
  };

  event.participants?.forEach(participant => {
    console.log(`participant id ${participant.id}`);
  });

  const isParticipating = event.participants?.some(
    participant => participant.id === currentUserId
  );

  const participantsCount = event.participants?.length || 0;

  return (
    <>
      <div className={styles.eventCard} onClick={handleEdit}>
        <div className={styles.cardHeader}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{event.title}</h3>
          </div>
          <div className={styles.actions}>
  {canEdit ? (
    <button
      onClick={handleDelete}
      className={styles.deleteButton}
      title="Удалить мероприятие"
    >
      ×
    </button>
  ) : (
    <div className={styles.invisibleButton}></div>
  )}
</div>

        </div>

        {event.description && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Описание:</span>
            <p className={styles.value}>{event.description}</p>
          </div>
        )}

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Дата и время:</span>
            <span className={styles.value}>{formatDate(event.date)}</span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.label}>Место:</span>
            <span className={styles.value}>{event.location}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.participantsSection}>
            {participantsCount > 0 && (
              <button
                className={styles.participantsButton}
                onClick={handleParticipantsClick}
                disabled={isLoadingParticipants}
                title="Посмотреть участников"
              >
                Участников: {participantsCount}
                {isLoadingParticipants && <span className={styles.loadingDot}>...</span>}
              </button>
            )}
          

          {!canEdit && (
            <button
              className={`${styles.participateButton} ${isParticipating ? styles.participating : ''}`}
              onClick={handleParticipate}
              disabled={isParticipating}
            >
              {isParticipating ? 'Вы участвуете' : 'Участвовать'}
            </button>
          )}
          </div>

          <span className={styles.createdAt}>
            Создано: {new Date(event.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>

      {isParticipantsModalOpen && (
        <ParticipantsModal
          isOpen={isParticipantsModalOpen}
          onClose={() => setIsParticipantsModalOpen(false)}
          participants={event.participants || []}
          eventTitle={event.title}
        />
      )}
    </>
  );
};

export default EventCard;