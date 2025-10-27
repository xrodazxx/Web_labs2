import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { addEvent, editEvent } from '../../store/slices/eventSlice';
import type { Event, CreateEventData } from '../../types/event';
import styles from './CreateEventModal.module.scss';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
  event?: Event;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  event,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isError, errorMessage } = useSelector((state: RootState) => state.events);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditMode = Boolean(event);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        location: ''
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название обязательно";
    } else if (formData.title.length > 20) {
      newErrors.title = "Название не должно превышать 20 символов";
    }

    if (formData.description.length > 50) {
      newErrors.description = "Описание не должно превышать 50 символов";
    }

    if (!formData.date) {
      newErrors.date = "Укажите дату и время";
    } else {
      const selectedDate = new Date(formData.date);
      if (selectedDate < new Date()) {
        newErrors.date = "Дата должна быть в будущем";
      }
    }

    if (!formData.location) {
      newErrors.location = "Выберите место на карте";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const eventData: CreateEventData = {
      ...formData,
      date: new Date(formData.date).toISOString()
    };

    try {
      if (isEditMode) {
        await dispatch(editEvent({
          id: event!.id,
          eventData
        })).unwrap();
        onUpdate?.();
      } else {
        await dispatch(addEvent(eventData)).unwrap();
        onCreate?.();
        setFormData({ title: '', description: '', date: '', location: '' });
      }
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (e: any) => {
    const coords = e.get('coords');
    const coordString = coords.join(', ');
    setFormData(prev => ({ ...prev, location: coordString }));
  };

  if (!isOpen) return null;

  const placemarkCoords = formData.location
    ? formData.location.split(',').map(Number)
    : null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? 'Редактировать мероприятие' : 'Создать мероприятие'}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isError && <div className={styles.error}>{errorMessage || 'Ошибка при сохранении'}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="title">Название *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Дата и время *</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Место проведения *</label>
            <YMaps>
              <Map
                defaultState={{
                  center: placemarkCoords || [55.751244, 37.618423],
                  zoom: 10,
                }}
                width="100%"
                height="300px"
                onClick={handleMapClick}
              >
                {placemarkCoords && (
                  <Placemark geometry={placemarkCoords} />
                )}
              </Map>
            </YMaps>
            <small>Координаты: {formData.location || 'не выбрано'}</small>
            {errors.location && <span className={styles.error}>{errors.location}</span>}
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Отмена
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className={styles.submitButton}
            >
              {isLoading 
                ? (isEditMode ? 'Сохранение...' : 'Создание...') 
                : (isEditMode ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
