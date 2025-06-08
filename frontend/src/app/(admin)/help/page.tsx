'use client'
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import styles from './Help.module.css';
import { Home, User, FileText, Calendar, HelpCircle, LogOut, Book,Menu, Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';


export default function dashboard() {
    const [isHovered, setIsHovered] = useState(false);
    const [admin, setAdmin] = useState({ first_name: '', last_name: '', profile_image: '' });


    const menItems = [
        { icon: <Home />, label: ' Admin ', href: '/admins' },
        { icon: <FileText />, label: ' Patient ', href: '/patient' },
        { icon: <Calendar />, label: ' Patient Details ', href: '/patientDetails' },
        { icon: <Book />, label: ' Appointment ', href: '/appointment' },
        { icon: <HelpCircle />, label: ' Help ', href: '/help' },
        { icon: <LogOut />, label: ' Logout ', href: '/logout' },
    ];
    const pathname = usePathname();
    const activeIndex = menItems.findIndex(item => pathname.startsWith(item.href));


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
    }, []);



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

            {/* <div className={styles.wrapper}>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={styles.sidebar}
                    style={{ width: isHovered ? '230px' : '65px' }}
                >
                    <h2 className={styles.adminTitle}>
                        {isHovered && (
                            <>
                                Name <span className={styles.adminHighlight}>ADMIN</span>
                            </>
                        )}
                    </h2>
                    {menItems.map((item, index) => (
                        <Link key={index} href={item.href} className={styles.menuItem}>
                            <span className={styles.menuIcon}>{item.icon}</span>
                            {isHovered && <span>{item.label}</span>}
                        </Link>
                    ))}
                </div>
            </div> */}

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
                                className={`${styles.menuItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
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
            </div>

        </div>
    );
}