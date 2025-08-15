import { httpRequest } from '@/services/api/httpsRequest';
import API_CONTROLLER from '@/services/config/api.config';

import { FileDetail, FolderDetail, GetFoldersAndFilesResponse } from './folder.service.types';

class FolderService {
    folderUrl = (endpoint = '') => API_CONTROLLER.user(endpoint);

    async getFoldersAndFiles(path: string) {
        return httpRequest<GetFoldersAndFilesResponse>(API_CONTROLLER.userFolders('/GetFoldersAndFiles'), {
            method: 'GET',
            queryParams: {
                path,
            },
        });
    }

    async getFolderDetail(path: string) {
        return httpRequest<FolderDetail>(API_CONTROLLER.userFolders('/getFolderDetail'), {
            method: 'GET',
            queryParams: {
                path,
            },
        });
    }

    async getUserDetail(id: string) {
        return httpRequest<FileDetail>(API_CONTROLLER.users(`/${id}`), {
            method: 'GET',
        });
    }

    async getOnlyFolders(path: string) {
        return httpRequest<GetFoldersAndFilesResponse['folders']>(API_CONTROLLER.userFolders('/GetOnlyFolders'), {
            method: 'GET',
            queryParams: {
                path,
            },
        });
    }

    async renameFolder(body: { currentPath: string; newName: string }) {
        return httpRequest(API_CONTROLLER.userFolders('/RenameFolder'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async renameFile(body: { folderPath: string; fileId: string; newFileName: string }) {
        return httpRequest(API_CONTROLLER.userFiles('/RenameFile'), {
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
        return httpRequest(API_CONTROLLER.userFiles('/DeleteFromMultipleSources'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async bulkDeleteFoldersAndFiles(body: { folderPaths: string[]; folderPathForFiles: string; fileIds: string[] }) {
        return httpRequest(API_CONTROLLER.userFiles('/BulkDeleteFoldersAndFiles'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async createFolder(body: { name: string; parentPath: string; icon: string }) {
        return httpRequest<GetFoldersAndFilesResponse['folders'][0]>(API_CONTROLLER.userFolders('/CreateFolder'), {
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
        return httpRequest<GetFoldersAndFilesResponse['files'][0]>(API_CONTROLLER.userFiles('/CreateUser'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async addComment(body: { path: string; comment: string }) {
        return httpRequest(API_CONTROLLER.userFolders('/AddComment'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async changeIcon(body: { path: string; icon: string }) {
        return httpRequest(API_CONTROLLER.userFolders('/ChangeIcon'), {
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
        return httpRequest(API_CONTROLLER.userFiles('/MoveFromMultipleSources'), {
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
        return httpRequest(API_CONTROLLER.userFiles('/MoveFoldersAndFiles'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async searchInFolder(queryParams: { path: string; keyword: string }) {
        return httpRequest<GetFoldersAndFilesResponse>(API_CONTROLLER.userFolders('/SearchInFolder'), {
            method: 'GET',
            queryParams,
        });
    }
}

export const folderService = new FolderService();
