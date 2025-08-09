import { Select } from 'antd';
import { Input } from 'antd';
import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { Field } from '@/types';
import 'leaflet/dist/leaflet.css';

import Button_group from '@/modules/_settings/layout/button-group';

import { S_Input, S_Select } from '@/ui';
import ImageUpload from '@/ui/image-upload';
import S_Textarea from '@/ui/textarea';

import styles from './style.module.css';

const FormBuilder: React.FC<{
    fields: Field[];
    loadingStatus: any;
    onSubmit: (formData: Record<string, string>, resetForm: () => void) => void;
    onFieldChange?: (fieldName: string, value: string) => void;
    hideButtons?: boolean;
    isSpecialPage?: boolean;
    errors?: Record<string, string>;
}> = ({ fields, onSubmit, onFieldChange, loadingStatus, hideButtons = false, isSpecialPage = false, errors = {} }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        Images: [],
        Location: '',
        Latitude: '',
        Longitude: '',
    });

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: name === 'group' ? (value.startsWith('Group-') ? value : `Group-${value}`) : value,
            };

            if (name === 'regionId') {
                updated['areaId'] = '';
            }

            return updated;
        });

        if (onFieldChange) {
            onFieldChange(name, value);
        }
    };
    const [showMap, setShowMap] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            await onSubmit(formData, () => setFormData({ Images: [] }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={`${styles.form_container} ${isSpecialPage ? styles.specialPage : ''}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <>
                        {field.type === 'select' ? (
                            <S_Select
                                items={
                                    loadingStatus === 'pending' ? [{ label: 'Yüklənir...', value: '' }] : field.options
                                }
                                label={field.label}
                                name={field.name}
                                placeholder={field.placeholder}
                                loadingStatus={'success'}
                                style={isSpecialPage ? { width: '31%' } : {}}
                                value={formData[field.name] || ''}
                                className={styles.selectOption}
                                errorText={errors[field.name]}
                                onChange={(selectedItems) => {
                                    const selectedValue = selectedItems.length > 0 ? selectedItems[0].value : '';
                                    handleChange(field.name, selectedValue.toString());
                                }}
                            />
                        ) : field.type === 'mySelect' ? (
                            <Select
                                popupClassName="custom-dropdown"
                                style={isSpecialPage ? { width: '31%' } : {}}
                                placeholder={field.placeholder || field.label}
                                options={field.options}
                                value={formData[field.name] || undefined}
                                onChange={(value) => handleChange(field.name, value)}
                                disabled={field.disabled}
                                status={errors[field.name] ? 'error' : ''}
                                showSearch={field.showSearch}
                                allowClear={field.allowClear}
                                notFoundContent="Məlumat tapılmadı"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        ) : field.type == 'myInput' ? (
                            <Input
                                name={field.name}
                                placeholder={field.placeholder}
                                type="text"
                                style={{ height: '40px' }}
                                value={formData[field.name] || ''}
                                className={styles.input}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        ) : field.type === 'textarea' ? (
                            <S_Textarea
                                label={field.label}
                                placeholder={field.placeholder}
                                rows={field.rows}
                                resize="vertical"
                                description={field.description}
                                errorText={errors[field.name]}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        ) : field.type === 'image' ? (
                            <ImageUpload
                                onChange={(val: any) => handleChange(field.name, val)}
                                error={errors[field.name]}
                            />
                        ) : field.type === 'map' ? (
                            <div className={styles.mapContainer}>
                                <S_Input
                                    type="text"
                                    name="Location"
                                    value={formData.Location}
                                    placeholder="Ünvanı seçmək üçün klikləyin"
                                    readOnly
                                    className={styles.input}
                                    label="Yerləşdiyi ünvan seç*"
                                    errorText={errors[field.name]}
                                    onClick={() => setShowMap(true)}
                                />
                                {showMap && (
                                    <div className={styles.mapModal}>
                                        <MapContainer
                                            center={{ lat: 40.4093, lng: 49.8671 }}
                                            zoom={13}
                                            style={{ height: '400px', width: '100%' }}
                                            onclick={(e: any) => {
                                                handleChange('Latitude', e.latlng.lat.toString());
                                                handleChange('Longitude', e.latlng.lng.toString());
                                                handleChange('Location', `Lat: ${e.latlng.lat}, Lng: ${e.latlng.lng}`);
                                                setShowMap(false);
                                            }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                                            <Marker
                                                position={{
                                                    lat: parseFloat(formData.Latitude) || 40.4093,
                                                    lng: parseFloat(formData.Longitude) || 49.8671,
                                                }}
                                                draggable
                                                eventHandlers={{
                                                    dragend: (e: any) => {
                                                        const { lat, lng } = e.target.getLatLng();
                                                        handleChange('Latitude', lat.toString());
                                                        handleChange('Longitude', lng.toString());
                                                        handleChange('Location', `Lat: ${lat}, Lng: ${lng}`);
                                                    },
                                                }}
                                            />
                                        </MapContainer>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <S_Input
                                className={styles.input}
                                label={field.label}
                                placeholder={field.placeholder}
                                errorText={errors[field.name]}
                                type={field.type}
                                style={isSpecialPage ? { width: '31%' } : {}}
                                value={
                                    field.name === 'group'
                                        ? formData[field.name] || 'Group-'
                                        : formData[field.name] || ''
                                }
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        )}
                    </>
                ))}
            </form>
            {!hideButtons && <Button_group onSubmit={handleSubmit} loading={loading} />}
        </section>
    );
};

export default FormBuilder;
