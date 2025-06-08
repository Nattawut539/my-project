'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './Appointment.module.css';
import Cookies from 'js-cookie';
import { Home, User, FileText, Calendar, HelpCircle, LogOut, Book, Menu, Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';


export default function AppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [admin, setAdmin] = useState({ first_name: '', last_name: '', profile_image: '' });


    /*
        useEffect(() => {
            const fetchAppointments = async () => {
                try {
                    const token = Cookies.get('admintoken');
                    const response = await axios.get('http://localhost:5000/api/appointments', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setAppointments(response.data);
                } catch (err) {
                    console.error('Error fetching appointments:', err);
                    setError('ไม่สามารถโหลดข้อมูลนัดหมายได้');
                }
            };
            fetchAppointments();
        }, []);
    */


    const menItems = [
        { icon: <Home />, label: ' Admin ', href: '/admins' },
        { icon: <FileText />, label: ' Patient ', href: '/patient' },
        { icon: <Calendar />, label: ' Patient Details ', href: '/patientDetails' },
        { icon: <Book />, label: ' Appointment ', href: '/appointment' },
        { icon: <HelpCircle />, label: ' Help ', href: '/help' },
        { icon: <LogOut />, label: ' Logout ', href: '/logout' },
    ];
    const pathname = usePathname();
    const activeIndex = menItems.findIndex(item => pathname === item.href);


    const fetchAppointment = async () => {
        try {
            const token = Cookies.get("adminToken");
            const res = await fetch('http://localhost:5000/api/appointments', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            const data = await res.json();
            setAppointments(data);
        } catch (error) {
            console.error("โหลดนัดหมายล้มเหลว", error);
            setError("ไม่สามารถโหลดข้อมูลได้");
        }
    };

    useEffect(() => {
        const token = Cookies.get("adminToken");
        console.log("token:", token); // ✅ ตรวจสอบว่า token มีจริงไหม

        if (token) {
            fetch("http://localhost:5000/api/admins/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(async res => {
                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(`HTTP ${res.status} - ${JSON.stringify(err)}`);
                    }
                    return res.json();
                })
                .then(data => setAdmin(data))
                .catch(err => console.error("Failed to load admin info:", err));
        }
        fetchAppointment();
    }, []);


    const handleApprove = async (appointment_id: string) => {
        try {
            const token = Cookies.get("adminToken");
            const res = await fetch(`http://localhost:5000/api/appointments/${appointment_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "approved" }),
            });
            const result = await res.json();
            if (res.ok) {
                alert("อนุมัติเรียบร้อย");
                setAppointments(prev => prev.filter(app => app.appointment_id !== appointment_id));
            } else {
                alert(result.message || "ไม่สามารถอนุมัติได้");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        }
    };





    const handleReject = async (appointment_id: number) => {
        try {
            const token = Cookies.get("adminToken");
            const res = await fetch(`http://localhost:5000/api/appointments/${appointment_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "cancelled" }),
            });

            if (!res.ok) throw new Error("ยกเลิกไม่สำเร็จ");

            alert("ยกเลิกนัดหมายแล้ว");
            setAppointments(prev =>
                prev.filter(app => app.appointment_id !== appointment_id)
            );
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        }
    };







    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.leftHeader}>
                    <img src="/img/profileclinic.png" alt="logo" className={styles.logoIcon} width={40} height={40} />
                    {/* <Imag src={logo} alt="logo" className={styles.logoIcon} width={40} height={40} /> */}
                    <span className={styles.brand}>คลินิกหมอปิยะพันธ์</span>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li><Link href="/dashboard">Home</Link></li>
                        <li><Link href="/dashboard">Customer service</Link></li>
                        <li><Link href="/dashboard">About Us</Link></li>
                    </ul>
                </nav>
                <div className={styles.rightHeader}>
                    <button className={styles.appointmentBtns}>APPOINTMENTS</button>
                    <div className={styles.avatarIcons}><User size={18} color="#333" /></div>
                    <div className={styles.menuIcons}><Menu size={20} color="#333" /></div>
                </div>
            </header>

            <div className={styles.wrapper}>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={styles.sidebar}
                    style={{ width: isHovered ? '230px' : '65px' }}
                >
                    <div className={styles.sidebarHeader}>
                        <div className={styles.avatarIcon}><img src={admin.profile_image || "/img/default-avatar.png"} alt="admin" className={styles.avatarImg} /></div>
                        {isHovered && <h1 className={styles.appointmentBtn}>{admin.first_name} {admin.last_name}  </h1>}
                    </div>

                    <nav className={styles.menu}>
                        {menItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`${styles.menuItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
                            >
                                <span className={styles.menuIcon}>{item.icon}</span>
                                {isHovered && <span>{item.label}</span>}
                            </Link>
                        ))}

                        {activeIndex >= 0 && (
                            <div
                                className={styles.highligth}
                                style={{ '--top': `${activeIndex * 58}px` } as React.CSSProperties}
                            />
                        )}
                    </nav>
                </div>

                <section className={styles.contentArea}>
                    <h2>รอการอนุมัติการจองคิว</h2>
                    {error && <p className={styles.error}>{error}</p>}

                    <table className={styles.appointmentTable}>
                        <thead>
                            <tr>
                                <th>▶️ดำเนินการ</th>
                                <th>▶️รหัสคนไข้</th>
                                <th>▶️วันที่นัด</th>
                                <th>▶️หัวข้อการนัด</th>
                                <th>▶️สถานะ</th>
                                <th>▶️วันที่สร้าง</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? (
                                appointments.map((item) => (
                                    <tr key={item.appointment_id}>
                                        <td>
                                            <button className={styles.button} onClick={() => handleApprove(item.appointment_id)}>อนุมัติ</button>
                                            <button className={styles.buttondelete} onClick={() => handleReject(item.appointment_id)}>ไม่อนุมัติ</button>
                                        </td>
                                        <td>{item.user_id}</td>
                                        <td>{new Date(item.appointment_date).toLocaleString()}</td>
                                        <td>{item.service_type}</td>
                                        <td>{item.status}</td>
                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center' }}>ไม่มีข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}
