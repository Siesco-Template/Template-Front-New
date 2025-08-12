import React, { useState } from 'react';

import { useAuthStore } from '@/store/authStore';

import {
    BriefCaseIcon,
    CallingIcon,
    IdCard,
    LogoutIcon,
    MailIcon,
    PencilIcon,
    PencilPaperIcon,
    TagIcon,
    UserCardIcon,
    UserRectangleIcon,
} from '@/shared/icons';

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
                            <S_Button variant="outlined-10" onClick={() => setIsEditing(true)}>
                                <PencilIcon /> Düzəliş et
                            </S_Button>

                            <S_Button variant="main-10" onClick={handleLogout}>
                                <LogoutIcon /> Çıxış
                            </S_Button>
                        </div>
                    </>
                ) : (
                    <div className={styles.editActions}>
                        <S_Button variant="outlined-10" onClick={handleCancel} className={styles.cancelBtn}>
                            Ləğv et
                        </S_Button>
                        <S_Button variant="main-10" onClick={handleSave} className={styles.saveBtn}>
                            Yadda saxla
                        </S_Button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <>
                    <div className={styles.profile}>
                        <div className={styles.icon}>
                            <BriefCaseIcon width={28} height={28} color="#5E6C77" />
                        </div>
                        <div>
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
                            className={styles.inputGroup}
                        />
                        <S_Input
                            label="Təşkilatın VÖEN-i"
                            name="voen"
                            value={form.voen}
                            onChange={handleChange}
                            className={styles.inputGroup}
                        />
                        <S_Input
                            label="Təşkilat kodu"
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            className={styles.inputGroup}
                        />
                        <S_Input
                            label="Asan imza nömrəsi"
                            name="asanImza"
                            value={form.asanImza}
                            onChange={handleChange}
                            className={styles.inputGroup}
                        />
                        <S_Input
                            label="İmzalayacaq məsul şəxsın S.A.A"
                            name="person"
                            value={form.person}
                            onChange={handleChange}
                            className={styles.inputGroup}
                        />
                        <S_Input
                            label="Əlaqə nömrəsi"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className={styles.inputGroup}
                            placeholder="+994 xx xxx-xx-xx"
                        />
                        <S_Input
                            label="E-mail"
                            name="email"
                            className={styles.inputGroup}
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

const InfoItem = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
    <div className={styles.item}>
        <div className={styles.icon}>{icon}</div>
        <div>
            <div className={styles.title}>{title}</div>
            <div className={styles.subtitle}>{subtitle}</div>
        </div>
    </div>
);

const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    name: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
}) => (
    <div className={styles.inputGroup}>
        <label>{label}</label>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
);

export default Profile;
