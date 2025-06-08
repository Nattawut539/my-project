
'use client';

import styles from './Appointment.module.css';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import { EllipsisVertical, Menu, User } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(weekday);
dayjs.extend(isoWeek);

export default function AppointmentPage() {
  const [date, setDate] = useState(dayjs());
  const currentMonth = date;
  const startDate = currentMonth.startOf('month').startOf('week');
  const days = Array.from({ length: 35 }, (_, i) => startDate.add(i, 'day'));

  const goToPrevMonth = () => setDate(date.subtract(1, 'month'));
  const goToNextMonth = () => setDate(date.add(1, 'month'));

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.leftHeader}>
          <Image src={logo} alt="logo" className={styles.logoIcon} width={40} height={40} />
          <span className={styles.brand}>คลินิกหมอปิยะพันธ์</span>
        </div>
        <nav className={styles.nav}>
          <a>Home</a>
          <a>Customer service</a>
          <a>About Us</a>
        </nav>
        <div className={styles.rightHeader}>
          <button className={styles.appointmentBtn}>APPOINTMENTS</button>
          <div className={styles.avatarIcon}><User size={18} color="#333" /></div>
          <div className={styles.menuIcon}><Menu size={20} color="#333" /></div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.leftPanel}>
          <div className={styles.titleRow}>
            <h2 className={styles.sectionTitle}>
              ตารางนัด
              <span className={styles.inlineToggle}>
                <button className={`${styles.toggleBtnSmall} ${styles.active}`}>All</button>
                <button className={styles.pending}>Pending</button>
              </span>
            </h2>
          </div>

          <div className={styles.appointmentList}>
            {[
              {
                title: 'ตรวจโรคทั่วไป',
                date: 'Thursday, 13 February',
                color: styles.purpleIcon
              },
              {
                title: 'คนไข้เข้ามาปรึกษา',
                date: 'Friday, 14 February',
                color: styles.greenIcon
              },
              {
                title: 'นัดติดตามอาการ',
                date: 'Saturday, 15 February',
                color: styles.redIcon
              }
            ].map(({ title, date, color }, idx) => (
              <div key={idx} className={styles.cardRowLight}>
                <div className={`${styles.icon} ${color}`}></div>
                <div className={styles.textGroup}>
                  <div className={styles.cardTitle}>{title}</div>
                </div>
                <div className={styles.dateAndIcon}>
                  <div className={styles.cardDate}>{date}</div>
                  <div className={styles.iconRight}><EllipsisVertical size={20} color="#aab0c5" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.calendarContainer}>
            <div className={styles.calendarHeader}>
              <h2 className={styles.monthText}>{currentMonth.format('MMMM YYYY')}</h2>
              <div className={styles.navGroup}>
                <button onClick={goToPrevMonth} className={styles.calendarNavBtn}>◀</button>
                <button onClick={goToNextMonth} className={styles.calendarNavBtn}>▶</button>
              </div>
            </div>
            <div className={styles.grid}>
              {days.map((day) => (
                <div key={day.toString()} className={styles.dayCell}>
                  <div className={styles.dateNumber}>{day.date()}</div>
                  <div className={styles.dayName}>{day.format('ddd')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        © 2025 คลินิกหมอปิยะพันธ์. All rights reserved.
      </footer>
    </div>
  );
} 