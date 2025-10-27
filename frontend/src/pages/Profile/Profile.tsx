import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import { fetchEvents, fetchUserEvents, removeEvent } from '../../store/slices/eventSlice';
import EventCard from '../../components/EventCard/EventCard';
import CreateEventModal from '../../components/CreateEventModal/CreateEventModal';
import type { Event } from '../../types/event';
import styles from './Profile.module.scss';
import { AiOutlineHome, AiOutlineCalendar, AiOutlineLogout, AiOutlinePlus } from 'react-icons/ai';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isLoading: profileLoading } = useSelector((state: RootState) => state.auth);
  const { events, isLoading: eventsLoading } = useSelector((state: RootState) => state.events);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();

  useEffect(() => {
    if (user) {
      dispatch(fetchUserEvents(user.id));
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToEvents = () => {
    navigate('/events');
  };

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    dispatch(removeEvent(id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(undefined);
  };

  const userEvents = events;

  if (profileLoading) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }

  if (!user) {
    return <div className={styles.error}>Пользователь не авторизован</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.navigationBar}>
        <button 
          onClick={navigateToHome}
          className={styles.navButton}
          title="На главную"
        >
          <AiOutlineHome size={24} />
          <span>Главная</span>
        </button>
        
        <button 
          onClick={navigateToEvents}
          className={styles.navButton}
          title="Все мероприятия"
        >
          <AiOutlineCalendar size={24} />
          <span>Мероприятия</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className={styles.navButton}
          title="Выйти из аккаунта"
        >
          <AiOutlineLogout size={24} />
          <span>Выйти</span>
        </button>
      </div>

      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img 
            src="/unknown-user.png" 
            alt="Аватар" 
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            onClick={handleCreateEvent}
            className={styles.createButton}
          >
            <AiOutlinePlus size={18} />
            Создать мероприятие
          </button>
        </div>
      </div>

      <div className={styles.eventsSection}>
        <div className={styles.sectionHeader}>
          <h2>Мои мероприятия</h2>
          <span className={styles.eventsCount}>
            {userEvents.length} мероприятий
          </span>
        </div>

        {eventsLoading ? (
          <div className={styles.loading}>Загрузка мероприятий...</div>
        ) : userEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <AiOutlineCalendar size={48} className={styles.emptyIcon} />
            <p>У вас пока нет созданных мероприятий</p>
            <button 
              onClick={handleCreateEvent}
              className={styles.createEmptyButton}
            >
              Создать первое мероприятие
            </button>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {userEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDeleteEvent}
                onEdit={handleEditEvent}
                canEdit={true}
                onParticipate={() => {}}
                onFetchParticipants={() => {}}
                currentUserId={user?.id || ''}
              />
            ))}
          </div>
        )}
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={() => {
          if (user) {
            dispatch(fetchUserEvents(user.id));
          }
          handleCloseModal();
        }}
        onUpdate={() => {
          if (user) {
            dispatch(fetchUserEvents(user.id));
          }
          handleCloseModal();
        }}
        event={editingEvent}
      />
    </div>
  );
};

export default Profile;