import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { DirectionLeftIcon, TrashIcon } from '@/shared/icons';

import { S_Button } from '@/ui';
import S_Input from '@/ui/input';
import S_Select_Simple, { Item } from '@/ui/select/select-simple';

import styles from './style.module.css';

const TOOLBAR_ID = 'notification-toolbar';

const modules = {
    toolbar: { container: `#${TOOLBAR_ID}` },
};
const formats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image'];

type FormValues = {
    recipients: Item[];
    title: string;
    body: string;
};

type Props = { onClose: () => void };

const recipients: Item[] = [
    { value: '1', label: 'Ahmet' },
    { value: '2', label: 'Mehmet' },
];

export default function NewNotification({ onClose }: Props) {
    const { control, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            recipients: [],
            title: '',
            body: '',
        },
    });

    const selectRef = useRef<HTMLDivElement>(null);
    const [selectWidth, setSelectWidth] = useState(0);
    useEffect(() => {
        const obs = new ResizeObserver(() => {
            if (selectRef.current) setSelectWidth(selectRef.current.offsetWidth);
        });
        selectRef.current && obs.observe(selectRef.current);
        return () => obs.disconnect();
    }, []);

    const onSubmit = (data: FormValues) => {
        console.log('send payload', data);
        // reset();
    };

    return (
        <form className={styles.newContentWrapper} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.notificationHeader}>
                <div className={styles.notificationHeaderLeft}>
                    <div className={styles.backButton} onClick={onClose}>
                        <DirectionLeftIcon width={14} height={14} />
                    </div>
                    <div className={styles.notificationHeaderTitle}>Yeni mesaj</div>
                </div>
                <div className={styles.notificationHeaderRight}>
                    <S_Button
                        variant="main-10"
                        isIcon
                        iconBtnSize="15"
                        color="secondary"
                        onClick={() => reset()}
                        aria-label="Sil"
                    >
                        <TrashIcon width={14} height={14} />
                    </S_Button>
                    <S_Button type="submit" variant="main-10">
                        Göndər
                    </S_Button>
                </div>
            </div>

            {/* custom toolbar */}
            <div id={TOOLBAR_ID} className={styles.customToolbar}>
                <span className="ql-formats">
                    <button className="ql-bold" />
                    <button className="ql-italic" title="Italic" />
                    <button className="ql-underline" title="Underline" />
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered"></button>
                    <select className="ql-align"></select>
                </span>
                <span className="ql-formats">
                    <button className="ql-link"></button>
                    <button className="ql-image"></button>
                    <button className="ql-video"></button>
                </span>
            </div>

            <div className={styles.notificationBody}>
                {/* recipients */}
                <div ref={selectRef}>
                    <Controller
                        name="recipients"
                        control={control}
                        render={({ field }) => (
                            <S_Select_Simple
                                name="nese"
                                items={recipients}
                                value={field.value.map((item) => item.value)}
                                setSelectedItems={field.onChange}
                                label="Alıcı"
                                placeholder="Seçin"
                                clearButton
                                itemsContentMinWidth={selectWidth}
                            />
                        )}
                    />
                </div>

                {/* title */}
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <S_Input {...field} label="Başlıq" placeholder="Başlıq daxil edin" />}
                />

                {/* rich-text body */}
                <div className={styles.notificationTextEditor}>
                    <p>Mətn</p>
                    <Controller
                        name="body"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                {...field}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                placeholder="Mesajınızı bura yazın…"
                            />
                        )}
                    />
                </div>
            </div>
        </form>
    );
}
