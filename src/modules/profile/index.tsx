import React, { useState } from 'react';

import { useAuthStore } from '@/store/authStore';

import { BriefCaseIcon, LogoutIcon, PencilIcon } from '@/shared/icons';

import { S_Button, S_Input } from '@/ui';

import styles from './style.module.css';

const Profile = () => {
    const { logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: 'User Username',
        voen: '1234567890',
        code: 'XYZ–2025',
        asanImza: '0551234567',
        person: 'Murad Əliyev Əli oğlu',
        phone: '+994 50 123 45 67',
        email: 'info@arhp.az',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <section className={styles.profileContainer}>
            <div className={styles.header}>
                <h2>Profil</h2>
                {!isEditing ? (
                    <>
                        <div className={styles.editActions}>
                            <S_Button variant="primary" color="secondary" onClick={() => setIsEditing(true)}>
                                <PencilIcon /> Düzəliş et
                            </S_Button>

                            <S_Button variant="primary" color="primary" onClick={handleLogout}>
                                <LogoutIcon color="var(--clr-content-brand-light)" /> Çıxış
                            </S_Button>
                        </div>
                    </>
                ) : (
                    <div className={styles.editActions}>
                        <S_Button
                            variant="primary"
                            color="secondary"
                            onClick={handleCancel}
                            className={styles.cancelBtn}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button variant="primary" color="primary" onClick={handleSave}>
                            Yadda saxla
                        </S_Button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <>
                    <div className={styles.profile}>
                        <div className={styles.icon}>
                            <BriefCaseIcon width={28} height={28} color="var(--content-secondary-brand-bold)" />
                        </div>
                        <div className={styles.profileInfo}>
                            <h1>{form.name}</h1>
                            <p>Təşkilatın adı</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.editGrid}>
                        <S_Input
                            label="Təşkilatın adı"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            size={'36'}
                        />
                        <S_Input label="Təşkilatın VÖEN-i" name="voen" value={form.voen} onChange={handleChange} />
                        <S_Input label="Təşkilat kodu" name="code" value={form.code} onChange={handleChange} />
                        <S_Input
                            label="Asan imza nömrəsi"
                            name="asanImza"
                            value={form.asanImza}
                            onChange={handleChange}
                        />
                        <S_Input
                            label="İmzalayacaq məsul şəxsın S.A.A"
                            name="person"
                            value={form.person}
                            onChange={handleChange}
                        />
                        <S_Input
                            label="Əlaqə nömrəsi"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+994 xx xxx-xx-xx"
                        />
                        <S_Input
                            label="E-mail"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="namesurname@gmail.com"
                        />
                    </div>
                </>
            )}
        </section>
    );
};

export default Profile;
