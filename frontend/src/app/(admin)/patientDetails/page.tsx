'use client'
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import styles from './patientDetails.module.css';
import { Home, User, FileText, Calendar, HelpCircle, LogOut, Book, Menu, Icon } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';


interface Appointment {
    appointment_id: number;
    first_name: string;
    last_name: string;
    user_id: number;
    appointment_date: string;
    service_type: string;
    status: string;
    created_at: string;
}

export default function PatientDetailsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [error, setError] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const [admin, setAdmin] = useState({ first_name: '', last_name: '', profile_image: '' });

    const fetchAppointments = async () => {
        const token = Cookies.get("adminToken");

        try {
            const res = await fetch('http://localhost:5000/api/appointments/approved-or-cancelled', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!res.ok) throw new Error('ดึงข้อมูลไม่สำเร็จ');
            const data = await res.json();
            setAppointments(data); // ✅ จะได้เฉพาะ approved + cancelled
        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (appointment_id: number) => {
        try {
            const token = Cookies.get("adminToken");
            const res = await fetch(`http://localhost:5000/api/appointments/${appointment_id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("ลบไม่สำเร็จ");
            alert("ลบถาวรเรียบร้อย");
            fetchAppointments(); // ดึงใหม่
        } catch (err) {
            alert("เกิดข้อผิดพลาด");
            console.error(err);
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
        fetchAppointments();
    }, [pathname]);

    const menItems = [
        { icon: <Home />, label: ' Admin ', href: '/admins' },
        { icon: <FileText />, label: ' Patient ', href: '/patient' },
        { icon: <Calendar />, label: ' Patient Details ', href: '/patientDetails' },
        { icon: <Book />, label: ' Appointment ', href: '/appointment' },
        { icon: <HelpCircle />, label: ' Help ', href: '/help' },
        { icon: <LogOut />, label: ' Logout ', href: '/logout' },
    ];
    const pathnames = usePathname();
    const activeIndex = menItems.findIndex(item => pathnames.startsWith(item.href));



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
                        {isHovered && <h1 className={styles.appointmentBtn}>{admin.first_name} {admin.last_name} </h1>}
                    </div>

                    <nav className={styles.menu}>
                        {menItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`${styles.menuItem} ${pathnames.startsWith(item.href) ? styles.active : ''}`}
                            >
                                <span className={styles.menuIcon}>{item.icon}</span>
                                {isHovered && <span>{item.label}</span>}
                            </Link>
                        ))}

                        {activeIndex >= 0 && (
                            <div
                                className={styles.highligth}
                                style={{ '--top': `${activeIndex * 56}px` } as React.CSSProperties}
                            />
                        )}
                    </nav>
                </div>

                <section className={styles.contentArea}>
                    <h1> รายการนัดหมายที่อนุมัติ / ไม่อนุมัติ</h1>
                    {error && <p className={styles.error}>{error}</p>}

                    <h2 style={{ marginTop: "40px" }}> นัดหมายที่อนุม้ติแล้ว✅</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>รหัสคนไข้</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>วันที่นัด</th>
                                <th>หัวข้อ</th>
                                <th>วันที่</th>
                                <th>ลบข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments
                                .filter(item => item.status === 'approved') // ✅ แสดงเฉพาะที่อนุมัติ
                                .map(item => (
                                    <tr key={item.appointment_id}>
                                        <td>{item.user_id}</td>
                                        <td>{item.first_name} {item.last_name}</td>
                                        <td>{new Date(item.appointment_date).toLocaleString()}</td>
                                        <td>{item.service_type}</td>
                                        <td>{new Date(item.created_at).toDateString()}</td>
                                        <td>
                                            <button className={styles.deleteButton} onClick={() => handleDelete(item.appointment_id)}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    <h2 style={{ marginTop: "40px" }}> นัดหมายที่ไม่อนุมัติ ❌</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>รหัสคนไข้</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>วันที่นัด</th>
                                <th>หัวข้อ</th>
                                <th>วันที่</th>
                                <th>ลบข้อมูล</th>

                            </tr>
                        </thead>
                        <tbody>
                            {appointments
                                .filter(item => item.status === 'cancelled') // ✅ แสดงเฉพาะที่ถูกยกเลิก
                                .map(item => (
                                    <tr key={item.appointment_id}>
                                        <td>{item.user_id}</td>
                                        <td>{item.first_name} {item.last_name}</td>
                                        <td>{new Date(item.appointment_date).toLocaleString()}</td>
                                        <td>{item.service_type}</td>
                                        <td>{new Date(item.created_at).toDateString()}</td>
                                        <td>
                                            <button className={styles.deleteButton} onClick={() => handleDelete(item.appointment_id)}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}