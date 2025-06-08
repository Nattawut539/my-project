'use client';

import styles from './Home.module.css';
import Image from 'next/image';
import { User, Menu } from 'lucide-react';

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.leftHeader}>
          <Image
            src="/logo.png"
            alt="logo"
            width={40}
            height={40}
            className={styles.logoIcon}
          />
          <span className={styles.brand}>คลินิกหมอปิยะพันธ์</span>
        </div>

        <nav className={styles.nav}>
          <a className={styles.active}>Home</a>
          <a>Customer service</a>
          <a>About Us</a>
        </nav>

        <div className={styles.rightHeader}>
          <button className={styles.appointmentBtn}>APPOINTMENTS</button>
          <div className={styles.avatarIcon}>
            <User size={20} />
          </div>
          <div className={styles.menuIcon}>
            <Menu size={20} />
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <Image
            src="/hero.png"
            alt="hero"
            fill
            className={styles.heroImg}
            style={{ objectPosition: '0% 90%' }}
          />

          <div className={styles.heroTextBoxRight}>
            <h1 className={styles.heroTitle}>
              อายุรกรรมทั่วไป<br />
              พร้อมให้คำปรึกษา<br />
              คลินิกหมอปิยะพันธ์<br />
              ยินดีให้บริการ
            </h1>
          </div>
        </div>
        

        <div className={styles.highlightBox}>
          <p className={styles.subText}>
            <strong>รับคำปรึกษา ฟรี</strong><br />
            <strong><span className={styles.indent}>ท่านที่สนใจสามารถติดต่อขอแน่นำการแพทย์คลินิกได้ทาง</span></strong>
            
          </p>
          <button className={styles.ctaBtn}>GET IT TOUCH</button>
        </div>
      </main>
    </div>
  );
}
