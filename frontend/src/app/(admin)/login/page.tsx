'use client'
import { useState } from 'react'
import styles from './login.module.css'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function AdminLoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const routes = useRouter();

    const handleLogin = async () =>{
        try{
            const res = await fetch("http://localhost:5000/api/admins/login",{
                method:"POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({username, password}),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            Cookies.set('adminToken', data.token);
            routes.push('/dashboard');
        }catch (err : any){
            setError(err.message);
        }
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <img src="/img/clinic.jpg" alt="ภาพคลินิก" style={{width : '300px'}} />
                <p className={styles.footer}> คลินิกปิยพันธ์ <br />@มหาสารคาม</p>
            </div>

            <div className={styles.rightPane}>
                <div className={styles.loginBox}>
                    <h2 className={styles.loginTitle}> Login </h2>
                    
                    <label className={styles.label}> Username </label>
                    <input 
                        type = "text"
                        placeholder=" Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.input}
                    />

                    <label className={styles.label}> Password </label>
                    <input 
                        type="password"
                        placeholder=" Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                    />

                    <a className={styles.forget}> FORGET PASSWORD ?</a>
                    <button onClick={handleLogin} className={styles.loginBth}> Login Admin </button>


                </div>
            </div>
        </div>
    );
}

