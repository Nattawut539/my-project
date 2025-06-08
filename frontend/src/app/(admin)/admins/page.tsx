'use client';
import { useState } from 'react';
import styles from './admin.module.css';
import Link from 'next/link';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { Home, User, FileText, Calendar, HelpCircle, LogOut, Book, Menu, Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PatientListPage() {
    const [nationalId, setNationalId] = useState('');
    const [patient, setPatient] = useState<any>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [allPatients, setAllPatients] = useState<any[]>([])
    const [isHovered, setIsHovered] = useState(false);
    const [admin, setAdmin] = useState({ first_name: '', last_name: '', profile_image: '' });



    
    const fetchAllPatients = async () => {
        const token = Cookies.get("adminToken");

        const res = await fetch("http://localhost:5000/api/patients", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลผู้ป่วยได้");
        const data = await res.json();
        setAllPatients(data);
    };

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




        const handleSearch = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/patients/national/${nationalId}`);
                if (!res.ok) throw new Error('ไม่พบผู้ป่วย');
                const data = await res.json();
                setPatient(data);
                setError('');
                setSuccess('');
            } catch (err: any) {
                setPatient(null);
                setError(err.message || 'เกิดข้อผิดพลาด');
                setSuccess('');
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setPatient({ ...patient, [e.target.name]: e.target.value });
        };

        const handleUpdate = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/patients/${patient.user_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patient),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'อัปเดตไม่สำเร็จ');
                setSuccess(data.message);
                setError('');
            } catch (err: any) {
                setError(err.message);
                setSuccess('');
            }
        };


    useEffect(() => {
        const loadPatients = async () => {
            try {
                await fetchAllPatients();  // ❌ แก้จาก setPatients(data) เป็น:
            } catch (error) {
                console.error("โหลดข้อมูลล้มเหลว:", error);
            }
        };

        loadPatients();
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

    const handleDateFormat = (date: string) => {
        return new Date(date).toDateString().split('T')[0];
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
                                style={{ '--top': `${activeIndex * 56}px` } as React.CSSProperties}
                            />
                        )}
                    </nav>
                </div>


                <section className={styles.contentArea}>
                    <h1>จัดการข้อมูลผู้ป่วย</h1>
                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.heading}>
                        <div className={styles.searchSection}>
                            <input
                                type="text"
                                value={nationalId}
                                onChange={(e) => setNationalId(e.target.value)}
                                placeholder="กรอกเลขบัตรประชาชน"
                                className={styles.searchInput}
                            />
                            <nav>
                                <ul>
                                    <button onClick={handleSearch} className={styles.searchButton}>ค้นหา</button>
                                </ul>
                            </nav>
                        </div>
                        {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
                        {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}
                        {patient && (
                            <>
                                <div className={styles.gridContainer}>

                                    <div className={styles.profileSection}>
                                        <img src={patient.profile_image || "/default-avatar.jpg"} alt="profile" className={styles.profileImage} />
                                        <p className={styles.userCode}>รหัสผู้ป่วย: {patient.user_id}</p>
                                    </div>

                                    <div className={styles.section}>
                                        <h2>ข้อมูลส่วนตัว</h2>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}>คำนำหน้า :</span>
                                            <input name='title' value={patient.title || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> ชื่อ :</span>
                                            <input name="first_name" value={patient.first_name || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> นามสกุล :</span>
                                            <input name="last_name" value={patient.last_name || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> วันเดือนปีเกิด :</span>
                                            <input name="dob" value={handleDateFormat(patient.dob)} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> อายุ :</span>
                                            <input name="age" value={patient.age || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> เพศ :</span>
                                            <input name="gender" value={patient.gender || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> สัญชาติ :</span>
                                            <input name="nationality" value={patient.nationality || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> เชื้อชาติ :</span>
                                            <input name="ethnicity" value={patient.ethnicity || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> สถานะ :</span>
                                            <input name="marital_status" value={patient.marital_status || ''} onChange={handleChange} className={styles.input} />
                                        </div>
                                    </div>


                                    <div className={styles.section}>
                                        <h3>อาชีพ</h3>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> อาชีพ :</span>
                                            <input name="occupation" value={patient.occupation || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <h4>อาการแพ้</h4>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> อาการแพ้ :</span>
                                            <input name="allergy" value={patient.allergy || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <h4>โรคประจำตัว</h4>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> โรคประจำตัว :</span>
                                            <input name="congenital_disease" value={patient.congenital_disease || ''} onChange={handleChange} className={styles.input} />
                                        </div>
                                    </div>


                                    <div className={styles.section}>
                                        <h3>ประเภทคนไข้</h3>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> ประเภทคนไข้ :</span>
                                            <input name="patient_type" value={patient.patient_type || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <h4>ระดับการรักษา</h4>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> ระดับการรักษา :</span>
                                            <input name="treatment_level" value={patient.treatment_level || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <h4>วันที่เข้ารับการรักษา</h4>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> วันที่เข้ารับการรักษา :</span>
                                            <input name="admit_date" value={handleDateFormat(patient.admit_date)} onChange={handleChange} className={styles.input} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> กรุ๊ปเลือด :</span>
                                            <input name="blood_type" value={patient.blood_type || ''} onChange={handleChange} className={styles.input} />
                                        </div>
                                    </div>


                                    <div className={styles.section}>
                                        <h3>ข้อมูลครอบครัว</h3>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> บิดา :</span>
                                            <input name="father_name" value={patient.father_name || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> เบอร์โทรบิดา :</span>
                                            <input name="father_phone" value={patient.father_phone || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> มารดา :</span>
                                            <input name="mother_name" value={patient.mother_name || ''} onChange={handleChange} className={styles.input} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> เบอร์โทรมารดา :</span>
                                            <input name="bloodmother_phone_type" value={patient.mother_phone || ''} onChange={handleChange} className={styles.input} />
                                        </div>
                                    </div>


                                    <div className={styles.section}>
                                        <h3>การติดต่อ</h3>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> เบอร์โทร :</span>
                                            <input name="phone" value={patient.phone || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> อีเมล :</span>
                                            <input name="email" value={patient.email || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> เบอร์ติดต่อฉุกเฉิน :</span>
                                            <input name="emergency_phone" value={patient.emergency_phone || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> อีเมลฉุกเฉิน :</span>
                                            <input name="emergency_email" value={patient.emergency_email || ''} onChange={handleChange} className={styles.input} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> ไลน์ฉุกเฉิน :</span>
                                            <input name="emergency_line" value={patient.emergency_line || ''} onChange={handleChange} className={styles.input} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.fixedLabel}> ที่อยู่ :</span>
                                            <input name="address" value={patient.address || ''} onChange={handleChange} className={styles.input} />
                                        </div>
                                    </div>

                                </div>


                                <button onClick={handleUpdate} className={styles.submitButton}>
                                    บันทึกข้อมูล
                                </button>
                            </>
                        )}
                        <div className={styles.allPatientsSection}>
                            <h2>ข้อมูลผู้ป่วยทั้งหมด</h2>

                            {allPatients.length > 0 && (
                                <table className={styles.patientTable}>
                                    <thead>
                                        <tr>
                                            <th>รหัสผู้ป่วย</th>
                                            <th>เลขบัตรประชาชน</th>
                                            <th>ชื่อ-นามสกุล</th>
                                            <th>เบอร์โทร</th>
                                            <th>ที่อยู่</th>
                                            <th>วันเกิด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allPatients.map((pat) => (
                                            <tr key={pat.user_id}>
                                                <td>{pat.user_id}</td>
                                                <td>{pat.national_id}</td>
                                                <td>{pat.first_name} {pat.last_name}</td>
                                                <td>{pat.phone}</td>
                                                <td>{pat.address}</td>
                                                <td>{new Date(pat.dob).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div >
    );
}
