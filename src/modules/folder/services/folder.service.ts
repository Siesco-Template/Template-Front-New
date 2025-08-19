import { httpRequest } from '@/services/api/httpsRequest';
import API_CONTROLLER from '@/services/config/api.config';

import { FileDetail, FolderDetail, GetFoldersAndFilesResponse } from './folder.service.types';

class FolderService {
    foldersUrl = (endpoint = '') => API_CONTROLLER.userFolders(endpoint);
    filesUrl = (endpoint = '') => API_CONTROLLER.userFiles(endpoint);
    usersUrl = (endpoint = '') => API_CONTROLLER.users(endpoint);

    async getFoldersAndFiles(path: string) {
        return httpRequest<GetFoldersAndFilesResponse>(this.foldersUrl('/GetFoldersAndFiles'), {
            method: 'GET',
            queryParams: {
                path,
            },
        });
    }

    async getFolderDetail(path: string) {
        return httpRequest<FolderDetail>(this.foldersUrl('/getFolderDetail'), {
            method: 'GET',
            queryParams: {
                path,
            },
        });
    }

    async getUserDetail(id: string) {
        return httpRequest<FileDetail>(this.usersUrl(`/${id}`), {
            method: 'GET',
        });
    }

    async getOnlyFolders(path: string) {
        return httpRequest<GetFoldersAndFilesResponse['folders']>(this.foldersUrl('/GetOnlyFolders'), {
            method: 'GET',
            queryParams: {
                path,
            },
        });
    }

    async renameFolder(body: { currentPath: string; newName: string }) {
        return httpRequest(this.foldersUrl('/RenameFolder'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async renameFile(body: { folderPath: string; fileId: string; newFileName: string }) {
        return httpRequest(this.filesUrl('/RenameFile'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async deleteFromMultipleSources(body: {
        folderPathsToDelete: string[];
        filesToDelete: {
            folderPath: string;
            fileId: string;
        }[];
    }) {
        return httpRequest(this.filesUrl('/DeleteFromMultipleSources'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async bulkDeleteFoldersAndFiles(body: { folderPaths: string[]; folderPathForFiles: string; fileIds: string[] }) {
        return httpRequest(this.filesUrl('/BulkDeleteFoldersAndFiles'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async createFolder(body: { name: string; parentPath: string; icon: string }) {
        return httpRequest<GetFoldersAndFilesResponse['folders'][0]>(this.foldersUrl('/CreateFolder'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async createUser(body: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        folderPath: string;
    }) {
        return httpRequest<GetFoldersAndFilesResponse['files'][0]>(this.filesUrl('/CreateUser'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async addComment(body: { path: string; comment: string }) {
        return httpRequest(this.foldersUrl('/AddComment'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async changeIcon(body: { path: string; icon: string }) {
        return httpRequest(this.foldersUrl('/ChangeIcon'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async moveFromMultipleSources(body: {
        targetPath: string;
        foldersToCopy: {
            sourcePath: string;
            folderName: string;
        }[];
        filesToCopy: {
            sourcePath: string;
            fileId: string;
        }[];
    }) {
        return httpRequest(this.filesUrl('/MoveFromMultipleSources'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async moveFoldersAndFiles(body: {
        sourcePath: string;
        targetPath: string;
        folderNames: string[];
        fileIds: string[];
    }) {
        return httpRequest(this.filesUrl('/MoveFoldersAndFiles'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async searchInFolder(queryParams: { path: string; keyword: string }) {
        return httpRequest<GetFoldersAndFilesResponse>(this.foldersUrl('/SearchInFolder'), {
            method: 'GET',
            queryParams,
        });
    }
}

export const folderService = new FolderService();
