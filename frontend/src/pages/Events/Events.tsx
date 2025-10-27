import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { 
  fetchEvents, 
  removeEvent, 
  participateInEvent, 
  fetchParticipants 
} from '../../store/slices/eventSlice';
import EventCard from '../../components/EventCard/EventCard.tsx';
import CreateEventModal from '../../components/CreateEventModal/CreateEventModal.tsx';
import type { Event } from '../../types/event.ts';
import styles from './Events.module.scss';
import { AiOutlineHome } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const Events: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, isLoading: eventsLoading, isError: eventsError, errorMessage } = useSelector((state: RootState) => state.events);
  const { user, isLoading: profileLoading } = useSelector((state: RootState) => state.auth);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDeleteEvent = async (id: string) => {
    try {
      await dispatch(removeEvent(id)).unwrap();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleParticipate = async (eventId: string) => {
    try {
      await dispatch(participateInEvent(eventId)).unwrap();
    } catch (err) {
      console.error('Error participating in event:', err);
      alert('Ошибка при участии в мероприятии');
    }
  };

  const handleFetchParticipants = async (eventId: string) => {
    try {
      await dispatch(fetchParticipants(eventId)).unwrap();
    } catch (err) {
      console.error('Error fetching participants:', err);
      throw err;
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsCreateModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingEvent(null);
  };

  const handleRetry = () => {
    dispatch(fetchEvents());
  };

  const loading = eventsLoading || profileLoading;

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.eventsContainer}>
      <header className={styles.header}>
        <button className={styles.homeButton} onClick={() => navigate('/')}>
          <AiOutlineHome size={28} />
        </button>
        <h1>Мероприятия</h1>
        {user && (
          <div className={styles.userInfo}>
            <div 
              className={styles.profileLink}
              onClick={() => navigate('/profile')}
            >
              <span className={styles.textContainer}>
                <span className={styles.normalText}>{user.name}</span>
                <span className={styles.hoverText}>Профиль</span>
              </span>
            </div>
          </div>
        )}
      </header>

      {eventsError && (
        <div className={styles.error}>
          {errorMessage || 'Ошибка при загрузке мероприятий'}
          <button onClick={handleRetry} className={styles.retryButton}>
            Повторить
          </button>
        </div>
      )}

      <div className={styles.mapContainer}>
        <YMaps>
          <Map
            defaultState={{
              center: [55.751244, 37.618423],
              zoom: 10,
            }}
            width="100%"
            height="400px"
          >
            {events
              .filter(ev => ev.location)
              .map(ev => {
                const coords = ev.location.split(',').map(Number); 
                return (
                  <Placemark
                    key={ev.id}
                    geometry={coords}
                    properties={{
                      balloonContent: `<strong>${ev.title}</strong><br/>${ev.description || ''}`,
                      hintContent: ev.title,
                    }}
                  />
                );
              })}
          </Map>
        </YMaps>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleCreateEvent}
          className={styles.createButton}
        >
          ✚ мероприятие
        </button>
      </div>

      <div className={styles.eventsGrid}>
        {events.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Мероприятий пока нет</p>
          </div>
        ) : (
          events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDeleteEvent}
              onEdit={handleEditEvent}
              onParticipate={handleParticipate}
              onFetchParticipants={handleFetchParticipants}
              canEdit={event.createdBy === user?.id}
              currentUserId={user?.id || ''}
            />
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onCreate={() => {
            dispatch(fetchEvents());
            handleCloseModal();
          }}
          onUpdate={() => {
            dispatch(fetchEvents());
            handleCloseModal();
          }}
          event={editingEvent ?? undefined}
        />
      )}
    </div>
  );
};

export default Events;