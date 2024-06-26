import { File as LCFile, Object as LCObject } from 'leancloud-storage'

export interface UserIdentity {
  id: string
  avatarURL: string
  username: string
  isPublic: boolean
}

export interface UserProfile extends UserIdentity {
  pictures: Picture[] | LCFile[]
  about: string
  birthDay: string | Date
  gender: string
  hometown: string
  lookingFor: string
  position: Position
  mbti: string
  school: string
  wish: string
  zodiac: string
  objectId: string
  User: UserObject
  more: string
  tone: string
  createdAt: string
  updatedAt: string
  follower?: number
  tags?: string[]
}

interface UserObject {
  objectId: string
}

export interface Position {
  longitude: number
  latitude: number
}

interface Picture {
  url: string
  mime_type: string
  name: string
  metaData: {
    size: number
    owner: string
  }
  bucket: string
  createdAt: string
  updatedAt: string
  objectId: string
}

export interface Status extends LCObject {
  id: string
  data: StatusData
  inboxType: string
  messageId: number
  username: string
  avatarURL: string
  isLast: boolean
}

interface StatusData {
  imageURL: string
  inboxType: string
  source: {
    objectId: string
  }
}

export interface StatusDisplay extends StatusData {
  objectId: string
}

export interface SmsTimestamp {
  message?: number
  like?: number
  follow?: number
  moment?: number
}

export type SmsMethod = 'like' | 'moment' | 'follow' | 'message'

export interface PrivateConvAttributes {
  type: 'private'
}

export interface GroupConvAttributes {
  type: Exclude<string, 'private'>
  AIs: string
  displayName: string
  coverURL: string
}

export type ConvAttributes = PrivateConvAttributes | GroupConvAttributes

export interface GroupConfig {
  id: string
  displayName: string
  coverURL: string
  description: string
  AIs: string[]
  welcomeMessages: { [id: string]: string }[]
}

export interface Sandbox extends GroupConfig {
  owner: string
  order: number
  createAt: string
  updateAt: string
  objectId: string
  skybox: Picture
}
