import styles from './Covid_19.module.css';
import { useTranslation } from 'react-i18next';

const Covid_19 = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* Image Section */}
      <div className={styles.imageContainer}>
        <img src="covid-19-image.jpg" alt={t('covid_19.title')} className={styles.image} />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <h1 className={styles.title}>{t('covid_19.title')}</h1>
        <p className={styles.description}>{t('covid_19.description')}</p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <h3 className={styles.statNumber}>98%</h3>
            <p>{t('covid_19.stat1')}</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statNumber}>200+</h3>
            <p>{t('covid_19.stat2')}</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statNumber}>24/7</h3>
            <p>{t('covid_19.stat3')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Covid_19;

