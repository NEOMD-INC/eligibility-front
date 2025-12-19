'use client'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import ProfileInfoForm from './components/forms/ProfileInfoForm'
import UpdatePasswordForm from './components/forms/UpdatePassword'
import { themeColors } from '@/theme'

export default function UserProfile() {
  return (
    <PageTransition>
      <div>
        <h3 style={{ fontSize: 25, fontWeight: 'bolder', marginBottom: '10px' }}>User Profile</h3>
        <div className="card bg-white shadow-md rounded-lg p-4">
          <h1 style={{ fontSize: 20, fontWeight: 'bolder', marginBottom: 20 }}>Profile Info</h1>
          <ProfileInfoForm />
        </div>

        <div className="card bg-white shadow-md rounded-lg p-4 mt-8">
          <h1 style={{ fontSize: 20, fontWeight: 'bolder', marginBottom: 20 }}>Update Password</h1>
          <UpdatePasswordForm />
        </div>
      </div>
    </PageTransition>
  )
}
