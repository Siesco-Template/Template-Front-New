import React, { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/authStore';

import { BriefCaseIcon, LogoutIcon, PencilIcon } from '@/shared/icons';

import { S_Button, S_Input } from '@/ui';
import { showToast } from '@/ui/toast/showToast';

import { authService } from '../auth/services/auth.service';
import styles from './style.module.css';

const Profile = () => {
    const { logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialForm, setInitialForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        userRole: '',
    });
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await authService.getProfile();
                if (profile) {
                    const newForm: any = {
                        firstName: profile.firstName ?? '',
                        lastName: profile.lastName ?? '',
                        phoneNumber: profile.phoneNumber ?? '',
                        email: profile.email ?? '',
                        userRole: profile.userRole ?? '',
                    };
                    setForm(newForm);
                    setInitialForm(newForm);
                }
            } catch (error) {
                console.error('Profil məlumatları alına bilmədi:', error);
                showToast({ label: 'Profil məlumatları alına bilmədi', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);
    const hasEmptyFields = !form.firstName || !form.lastName || !form.phoneNumber || !form.email;

    const handleSave = async () => {
        if (hasEmptyFields) {
            showToast({ label: 'Heç bir sahə boş ola bilməz', type: 'warning' });
            return;
        }
        try {
            await authService.updateProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                phoneNumber: form.phoneNumber,
                email: form.email,
            });
            setInitialForm(form);
            setIsEditing(false);
            showToast({ label: 'Profil uğurla yeniləndi', type: 'success' });
        } catch (error) {
            console.error('Profil yenilənmədi:', error);
            showToast({ label: 'Profil yenilənmədi', type: 'error' });
        }
    };

    const handleCancel = () => {
        setForm(initialForm);
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
                        <S_Button
                            variant="primary"
                            color="primary"
                            onClick={handleSave}
                            disabled={!hasChanges || hasEmptyFields}
                        >
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
                            <h1>
                                {form?.firstName} {form?.lastName}
                            </h1>
                            <p>{form?.email}</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.editGrid}>
                        <S_Input
                            label="İstifadəçi adı"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                        />
                        <S_Input
                            label="İstifadəçi soyadı"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                        />
                        <S_Input
                            label="Əlaqə nömrəsi"
                            name="phoneNumber"
                            value={form.phoneNumber}
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
