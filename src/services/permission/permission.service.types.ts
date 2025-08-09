export interface ActionOption {
    key: string;
    name: string;
}

export interface Permission {
    pageKey: string;
    actionKeys: string[];
}

export interface PageActions {
    key: string;
    name: string;
    actions: ActionOption[];
}

export interface UserPermissions {
    userId: string;
    fullName: string;
    permissions: Permission[];
}

export interface PermissionUpdateBody {
    userId: string;
    permissions: {
        key: string;
        actions: string[];
    }[];
}
