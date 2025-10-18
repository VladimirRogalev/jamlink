export interface ISong {
  id: string;
  title: string;
  artist: string;
  imageUrl?: string;
  data: SongLine[];
}

export type SongLine = ISongItem[];

export interface ISongItem {
  lyrics: string;
  chords?: string;
}

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IUserCredentials {
  username: string;
  password?: string;
}

export interface IGroup {
  id: string;
  name: string;
  adminId: string;
  createdAt: Date;
}

export interface IUser {
  id: string;
  username: string;
  instrument?: string;
  email?: string;
  password?: string;
  googleId?: string;
  displayName?: string;
  role: UserRole;
  groupId?: string;
  groupName?: string;
  imageUrl?: string;
}

export interface IGoogleUserProfile {
  googleId: string;
  username: string;
  email?: string;
  displayName?: string;
  role: UserRole;
  imageUrl?: string;
}
