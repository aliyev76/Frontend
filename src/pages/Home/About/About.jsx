import React from 'react';
import styles from './About.module.css';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.aboutContainer}>
      {/* Company Profile Section */}
      <section className={styles.section}>
        <div className={styles.textContent}>
          <h2>{t('about_company.title')}</h2>
          <p>{t('about_company.description')}</p>
        </div>
        <div className={styles.imageContent}>
          <img src="/path/to/company_image.jpg" alt={t('about_company.title')} />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className={styles.section}>
        <div className={styles.textContent}>
          <h2>{t('mission_vision.title')}</h2>
          <p>{t('mission_vision.description')}</p>
        </div>
        <div className={styles.imageContent}>
          <img src="/path/to/mission_image.jpg" alt={t('mission_vision.title')} />
        </div>
      </section>
    </div>
  );
};

export default About;

