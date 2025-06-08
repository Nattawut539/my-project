'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from '../patientDetails.module.css';

interface User {
    user_id: number;
    name: string;
    phone: string;
    address: string;
}

export default function PatientDetailsPage() {
    const { id } = useParams();
    const [patient, setPatient] = useState<User | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/users/${id}`);
                if (!res.ok) throw new Error('ดึงข้อมูลผู้ป่วยไม่สำเร็จ');
                const data = await res.json();
                setPatient(data);
            } catch (err: any) {
                setError(err.message || 'เกิดข้อผิดพลาด');
            }
        };

        fetchPatient();
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!patient) return <p>กำลังโหลดข้อมูล.....</p>

    return (
        <div className={styles.contentArea}>
            <h1 className={styles.container}>ข้อมูลผู้ป่วย</h1>
            <div className={styles.info}><span className={styles.label}>ชื่อ :</span>{patient.name}</div>
            <div className={styles.info}><span className={styles.label}>เบอร์โทร :</span>{patient.phone}</div>
            <div className={styles.info}><span className={styles.label}>ที่อยู่ :</span>{patient.address}</div>
        </div>
    );
} 