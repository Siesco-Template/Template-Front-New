export enum UserRole {
    SIMPLE_USER = 1,
    ADMIN = 4,
    SUPER_ADMIN = 5,
}

export const userRoleOptions = [
    { value: UserRole.SUPER_ADMIN.toString(), label: 'Super Admin' },
    { value: UserRole.ADMIN.toString(), label: 'Admin' },
    { value: UserRole.SIMPLE_USER.toString(), label: 'Istifədəçi' },
];
