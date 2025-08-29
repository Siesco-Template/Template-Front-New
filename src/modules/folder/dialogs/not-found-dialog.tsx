import { S_Button } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog/shared';

interface NotFoundDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    path: string;
}

export function NotFoundDialog({ open, onOpenChange, path }: NotFoundDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent className="!max-w-xl">
                <DialogHeader>
                    <DialogTitle>Məlumat tapılmadı</DialogTitle>
                </DialogHeader>
                <div className="!mb-4 !text-gray-500">
                    <span className="italic !text-gray-600">{path}</span> ünvanı tapılmadı. Zəhmət olmasa daxil
                    etdiyiniz ünvanı yenidən yoxlayın
                </div>
                <DialogFooter autoFocus={false}>
                    <S_Button variant="outlined-20" onClick={() => onOpenChange(false)}>
                        Ləğv et
                    </S_Button>
                    <S_Button variant="main-20" onClick={() => onOpenChange(false)}>
                        Ok
                    </S_Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
