import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/az';
import { Loader2 } from 'lucide-react';

import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

import { folderService } from '../services/folder.service';
import { FolderItem } from '../types';
import styles from './style.module.css';

interface DetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: FolderItem | null;
}

function formatDate(date?: Date) {
    if (!date) return '-';
    return dayjs(date).locale('az').format('dddd, DD MMMM YYYY HH:mm');
}

export function DetailsDialog({ open, onOpenChange, item }: DetailsDialogProps) {
    const [itemDetails, setItemDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchFolderDetails = async () => {
            try {
                setIsLoading(true);
                const data = await folderService.getFolderDetail(item?.path || '');
                setItemDetails(data);
            } catch (error: any) {
                showToast({ label: error?.data?.message || 'Xəta baş verdi, yenidən cəhd edin', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        const fetchFileDetails = async () => {
            try {
                setIsLoading(true);
                const data = await folderService.getUserDetail(item?.path || '');
                setItemDetails(data);
            } catch (error: any) {
                showToast({ label: error?.data?.message || 'Xəta baş verdi, yenidən cəhd edin', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        if (item?.type === 'folder') {
            fetchFolderDetails();
        } else {
            fetchFileDetails();
        }
    }, [item]);

    const folderDetails = useMemo(() => {
        return (
            <Modal
                title="Detallar"
                open={open}
                size="sm"
                onOpenChange={onOpenChange}
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button variant="primary" color="primary" type="button" onClick={() => onOpenChange(false)}>
                            Ok
                        </S_Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-y-5 !text-[16px] !overflow-y-hidden !px-2">
                    <div className="flex justify-between">
                        <span className={styles.key}>Tipi:</span>
                        <span className={styles.value}>Folder</span>
                    </div>

                    <div className="flex justify-between">
                        <span className={styles.key}>Ünvan:</span>
                        <span className={styles.value}>{itemDetails?.path || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={styles.key}>Yaranma tarixi:</span>
                        <span className={styles.value}>{formatDate(new Date(itemDetails?.createDate))}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className={styles.key}>Düzəliş tarixi:</span>
                        <span className={styles.value}>{formatDate(new Date(itemDetails?.updateDate))}</span>
                    </div>
                    <div>
                        <div className={styles.key}>Komment</div>
                        <div className={styles.value}>
                            {itemDetails?.comment ? itemDetails?.comment : <span className={styles.value}>-</span>}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }, [itemDetails]);

    const fileDetails = useMemo(() => {
        return (
            <Modal
                title="Detallar"
                open={open}
                size="sm"
                onOpenChange={onOpenChange}
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button variant="primary" color="primary" type="button" onClick={() => onOpenChange(false)}>
                            Ok
                        </S_Button>
                    </div>
                }
            >
                <div className="!space-y-2 !text-[16px] !overflow-y-hidden !px-2">
                    <div className="flex justify-between">
                        <span className="!font-medium !text-gray-700">Tipi:</span>
                        <span className="font-normal text-gray-500">File</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="!font-medium !text-gray-700">Ünvan:</span>
                        <span className="font-normal break-all text-gray-500">{item?.path || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="!font-medium !text-gray-700">Adı:</span>
                        <span className="font-normal text-gray-500">{itemDetails?.firstName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="!font-medium !text-gray-700">Soyadı:</span>
                        <span className="font-normal text-gray-500">{itemDetails?.lastName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="!font-medium !text-gray-700">Yaranma tarixi:</span>
                        <span className="font-normal text-gray-500">
                            {formatDate(new Date(itemDetails?.createDate))}
                        </span>
                    </div>
                </div>
            </Modal>
        );
    }, [itemDetails]);

    const renderDetails = () => {
        if (isLoading) {
            return (
                <Modal open={open} onOpenChange={onOpenChange} size="sm">
                    <div className="flex justify-center items-center !min-h-[200px]">
                        <Loader2 className="!w-10 !h-10 animate-spin !text-gray-500" />
                    </div>
                </Modal>
            );
        }
        return item?.type === 'folder' ? folderDetails : fileDetails;
    };

    return renderDetails();
}
