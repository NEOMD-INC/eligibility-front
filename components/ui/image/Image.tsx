import Image from 'next/image'

import { ImageProps, UserProfileImageProps } from '@/types/ui/image'

const DefaultImage = ({ gender }: ImageProps) => {
  const imageSource =
    gender === 'male' ? '/media/svg/avatars/001-boy.svg' : '/media/svg/avatars/014-girl-7.svg'

  return <img src={imageSource} alt="" />
}
export default DefaultImage

export const UserProfileImage = ({ profileImagePath, width, square }: UserProfileImageProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const placeholderImage = '/images/profile.png'
  const hasImage = profileImagePath && profileImagePath.trim() !== ''
  const imageSrc = hasImage ? `${baseUrl}${profileImagePath}` : placeholderImage
  const imageWidth =
    typeof width === 'string' ? parseInt(width.replace('px', '')) || 40 : width || 40
  const imageHeight = imageWidth
  const imageClassName = square ? 'rounded' : 'rounded-circle'
  const isExternalUrl =
    profileImagePath?.startsWith('http://') || profileImagePath?.startsWith('https://')
  // const isLocalPath = !hasImage || (!isExternalUrl && !baseUrl)

  if (hasImage && (isExternalUrl || baseUrl)) {
    return (
      <img
        className={imageClassName}
        src={imageSrc}
        alt="Profile"
        width={imageWidth}
        height={imageHeight}
        style={{ width: width, height: imageHeight, objectFit: 'cover' }}
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt="Profile"
      width={imageWidth}
      height={imageHeight}
      className={imageClassName}
      unoptimized={imageSrc.endsWith('.png')}
    />
  )
}
