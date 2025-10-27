import React from "react";
import styles from "./NotFound.module.scss";

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img 
          src="/404.jpg"
          alt="Не найдено" 
          className={styles.image}
        />
        <h1 className={styles.title}>404 - Страница не найдена</h1>
        <p className={styles.text}>
          Извините, но страница, которую вы ищете, не существует.
        </p>
      </div>
    </div>
  );
};

export default NotFound;