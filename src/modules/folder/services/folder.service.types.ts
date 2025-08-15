import { UserRole } from '@/shared/constants/enums';

export interface GetFoldersAndFilesResponse {
    folders: {
        name: string;
        path: string;
        icon: string;
        createDate: string;
    }[];
    files: {
        id: string;
        fileName: string;
        createDate: string;
        folderPath: null;
    }[];
}

export interface FolderDetail {
    name: string;
    path: string;
    comment: string | null;
    createDate: string;
    updateDate: string;
}

export interface FileDetail {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    email: string;
    isBlock: boolean;
    appUserRole: UserRole;
}
