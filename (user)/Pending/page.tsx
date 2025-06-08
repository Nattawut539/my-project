'use client';

import styles from './Pending.module.css';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import { EllipsisVertical, Menu, User } from 'lucide-react';
import { CalendarClock, Clock, Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(weekday);
dayjs.extend(isoWeek);

export default function PendingPage() {
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
                <button className={styles.pending}>All</button>
                <button className={`${styles.toggleBtnSmall} ${styles.active}`}>Pending</button>
              </span>
            </h2>
          </div>
          <form className={styles.bookingForm}>
            <label className={styles.formTitle}>กำหนดการนัดหมายแบบจองได้</label>
            <input
              type="text"
              placeholder="กรุณาใส่หัวข้อนัดหมาย"
              className={styles.input}
            />

            <label className={styles.labelWithIcon}>
              <Calendar size={25} className={styles.iconSvg} />
              เลือกวันนัด
            </label>

            <select className={styles.dropdown}>
              <option disabled selected>เลือกวันที่ต้องการ</option>
              <option value="จันทร์">จันทร์</option>
              <option value="อังคาร">อังคาร</option>
              <option value="พุธ">พุธ</option>
              <option value="พฤหัส">พฤหัส</option>
              <option value="ศุกร์">ศุกร์</option>
              <option value="เสาร์">เสาร์</option>
              <option value="อาทิตย์">อาทิตย์</option>
            </select>

            <label className={styles.labelWithIcon}>
              <Clock size={25} className={styles.iconSvg} />
              เลือกช่วงเวลา
            </label>

            <div className={styles.timeSlotContainer}>
              {[
                '18:00 – 18:30pm',
                '18:30 – 19:00pm',
                '19:00 – 19:30pm',
                '19:30 – 20:00pm',
                '20:00 – 20:30pm',
                '20:30 – 21:00pm',
              ].map((slot, idx) => (
                <label key={idx} className={styles.timeSlot}>
                  <input type="radio" name="timeSlot" /> {slot}
                </label>
              ))}
            </div>

            <button type="submit" className={styles.submitBtn}>Completed</button>
            <p className={styles.noteText}>
              หมายเหตุ: กรุณานัดหมายล่วงหน้าผ่านแอดมินเท่านั้น
            </p>
          </form>


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