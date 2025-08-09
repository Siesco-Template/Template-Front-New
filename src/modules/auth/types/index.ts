export type IColorType = 'primary' | 'red' | 'green' | "light";

export interface UserData {
  userId: string,
  fullName: string,
  userRole: number,
  accessToken: string,
  expires: string,
  refreshToken: string,
}