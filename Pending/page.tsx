'use client';

import styles from './Pending.module.css';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import { Menu, User, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useRouter } from 'next/navigation';

dayjs.extend(weekday);
dayjs.extend(isoWeek);

export default function PendingPage() {
  const router = useRouter();
  const [date, setDate] = useState(dayjs());
  const currentMonth = date;
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('month');
  const startDayIndex = firstDayOfMonth.day(); // 0 = Sunday

  const days = Array.from({ length: startDayIndex + daysInMonth }, (_, i) =>
    i < startDayIndex ? null : firstDayOfMonth.add(i - startDayIndex, 'day')
  );

  const goToPrevMonth = () => setDate(date.subtract(1, 'month'));
  const goToNextMonth = () => setDate(date.add(1, 'month'));

  const isTimePast = (timeString: string) => {
    const now = dayjs();
    const [hour, minute] = timeString.split(':').map(Number);
    const slotTime = dayjs().hour(hour).minute(minute);
    return slotTime.isBefore(now);
  };

  const morningOptions = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30'];
  const afternoonOptions = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title");
    const morning = formData.get("morningSlot");
    const afternoon = formData.get("afternoonSlot");

    if (!title) {
      alert("กรุณากรอกหัวข้อนัดหมาย");
      return;
    }

    if (morning && afternoon) {
      alert("กรุณาเลือกช่วงเวลาแค่ช่วงเดียว (เช้าหรือบ่าย)");
      return;
    }

    if (!morning && !afternoon) {
      alert("กรุณาเลือกช่วงเวลาอย่างน้อย 1 ช่วง");
      return;
    }

    const selectedSlot = morning || afternoon;

    console.log({
      title,
      date: dayjs().format("YYYY-MM-DD"),
      time: selectedSlot,
    });

    alert("ส่งนัดสำเร็จ!");
    e.currentTarget.reset();
  };

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
                <button
                  className={styles.pending}
                  onClick={() => router.push('/Appointment')}
                >
                  All
                </button>
                <button className={`${styles.toggleBtnSmall} ${styles.active}`}>
                  Pending
                </button>
              </span>
            </h2>
          </div>

          <form className={styles.bookingForm} onSubmit={handleSubmit}>
            <label className={styles.formTitle}>กำหนดการนัดหมายแบบจองได้</label>

            <input
              type="text"
              name="title"
              placeholder="กรุณาใส่หัวข้อนัดหมาย"
              className={styles.input}
            />

            <label className={styles.labelWithIcon}>
              <Calendar size={25} className={styles.iconSvg} />
              วันที่นัดหมาย (ระบบกำหนดอัตโนมัติ)
            </label>

            <p className={styles.readonlyDate}>
              {dayjs().format('DD/MM/YYYY')}
            </p>

            <input
              type="hidden"
              name="selectedDate"
              value={dayjs().format('YYYY-MM-DD')}
            />

            <label className={styles.labelWithIcon}>
              <Clock size={25} className={styles.iconSvg} />
              เลือกช่วงเวลา
            </label>

            <div className={styles.timeRow}>
              <select className={styles.timeDropdown} name="morningSlot">
                <option value="">ช่วงเช้า</option>
                {morningOptions.map((time) => {
                  const [h, m] = time.split(':');
                  const endTime = dayjs().hour(+h).minute(+m).add(30, 'minute').format('HH:mm');
                  return (
                    <option
                      key={time}
                      value={`${time}–${endTime}`}
                      disabled={isTimePast(time)}
                    >
                      {`${time} – ${endTime}`}
                    </option>
                  );
                })}
              </select>

              <select className={styles.timeDropdown} name="afternoonSlot">
                <option value="">ช่วงบ่าย</option>
                {afternoonOptions.map((time) => {
                  const [h, m] = time.split(':');
                  const endTime = dayjs().hour(+h).minute(+m).add(30, 'minute').format('HH:mm');
                  return (
                    <option
                      key={time}
                      value={`${time}–${endTime}`}
                      disabled={isTimePast(time)}
                    >
                      {`${time} – ${endTime}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>Completed</button>

            <p className={styles.noteText}>
              *หมายเหตุ: หน้านี้ใช้สำหรับนัดหมายภายในวันนี้เท่านั้น หากต้องการจองล่วงหน้า กรุณาติดต่อเจ้าหน้าที่
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
              {['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map((day, index) => (
                <div key={index} className={styles.dayName}>{day}</div>
              ))}

              {days.map((day, index) =>
                day ? (
                  <div
                    key={index}
                    className={`${styles.dayCell} ${day.isSame(dayjs(), 'day') ? styles.today : ''}`}
                  >
                    <div className={styles.dateNumber}>{day.date()}</div>
                  </div>
                ) : (
                  <div key={index} className={styles.dayCell}></div>
                )
              )}
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
