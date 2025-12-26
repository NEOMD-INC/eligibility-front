export type Gender = 'male' | 'female'

export interface ImageProps {
  gender?: Gender
}

export interface UserProfileImageProps {
  profileImagePath?: string | null
  gender?: Gender
  width?: string | number
  square?: boolean
}
