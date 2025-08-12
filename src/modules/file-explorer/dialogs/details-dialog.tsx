import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/az';
import { Loader2 } from 'lucide-react';

import { S_Button } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';

import { FolderItem } from '../types';

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
            setIsLoading(true);
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/auth/UserFolders/GetFolderDetail?path=${item?.path}`
            );
            const data = await res.json();
            setItemDetails(data);
            setIsLoading(false);
        };
        const fetchFileDetails = async () => {
            setIsLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/Users/${item?.id}`);
            const data = await res.json();
            setItemDetails(data);
            setIsLoading(false);
        };

        if (item?.type === 'folder') {
            fetchFolderDetails();
        } else {
            fetchFileDetails();
        }
    }, [item]);

    const folderDetails = useMemo(() => {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="!max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="!text-2xl !font-bold !mb-2">Detallar</DialogTitle>
                    </DialogHeader>
                    {/* <div className="!border-b !mb-4" /> */}
                    <div className="!space-y-2 !text-[16px] !overflow-y-hidden !px-2">
                        <div className="flex justify-between">
                            <span className="!font-medium !text-gray-700">Tipi:</span>
                            <span className="font-normal !text-gray-400">Folder</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="!font-medium !text-gray-700">Ünvan:</span>
                            <span className="font-normal break-all !text-gray-400">{itemDetails?.path || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="!font-medium !text-gray-700">Yaranma tarixi:</span>
                            <span className="font-normal !text-gray-400">
                                {formatDate(new Date(itemDetails?.createDate))}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="!font-medium !text-gray-700">Düzəliş tarixi:</span>
                            <span className="font-normal !text-gray-500">
                                {formatDate(new Date(itemDetails?.updateDate))}
                            </span>
                        </div>
                        <div>
                            <div className="!font-medium !text-gray-700 !mb-1">Komment</div>
                            <div className="!text-gray-500 whitespace-pre-line !text-[15px]">
                                {itemDetails?.comment ? (
                                    itemDetails?.comment
                                ) : (
                                    <span className="!text-gray-500">-</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="!mt-6">
                        <S_Button variant="main-20" type="button" onClick={() => onOpenChange(false)}>
                            Ok
                        </S_Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }, [itemDetails]);

    const fileDetails = useMemo(() => {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="!max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="!text-2xl !font-bold !mb-2">Detallar</DialogTitle>
                    </DialogHeader>
                    {/* <div className="!border-b !mb-4" /> */}
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
                    <DialogFooter className="mt-6">
                        <S_Button variant="main-20" type="button" onClick={() => onOpenChange(false)}>
                            Ok
                        </S_Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }, [itemDetails]);

    const renderDetails = () => {
        if (isLoading) {
            return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent>
                        <div className="flex justify-center items-center !min-h-[200px]">
                            <Loader2 className="!w-10 !h-10 animate-spin !text-gray-500" />
                        </div>
                    </DialogContent>
                </Dialog>
            );
        }
        return item?.type === 'folder' ? folderDetails : fileDetails;
    };

    return renderDetails();
}
