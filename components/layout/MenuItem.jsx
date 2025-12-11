'use client'

import Link from 'next/link'
import axios from 'axios'
// import { useSelector } from 'react-redux'
import { UserProfileImage } from '@/components/ui/image/Image'
import profilePicture from "../../public/images/profile.png"

const MenuItems = () => {
  const myUserProfile = null
  // useSelector((state) => state?.app?.user ?? null)

  const logoutbtn = async (e) => {
    e.preventDefault()

    if (typeof window === 'undefined') {
      return;
    }

    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') : null;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,     
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/logout`, config);
    } catch (error) {
      console.error('Error:', error);
    }
    
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    window.location.reload();
  };
  
  return (
    <div className='absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-4 text-sm font-semibold w-64 z-50'>
      <div className='px-3 mb-3'>
        <div className='flex justify-center items-center'>
          <div className='w-12 h-12 flex justify-center items-center'>
            <UserProfileImage profileImagePath={myUserProfile ? profilePicture : myUserProfile?.profile_image_path} gender={myUserProfile ? myUserProfile?.gender : "male"} />
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center mb-3'>
        <div className='font-bold text-base text-center mb-1'>
          Product
        </div>
        <div className='text-xs text-gray-500 mb-2'>Super Admin</div>
        <div className='bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded'>
          admin name
        </div>
      </div>

      <div className='border-t border-gray-200 my-2'></div>

      <div className='px-3 hover:bg-gray-50 rounded'>
        <Link href={`/user-profile`} className='block px-3 py-2 text-gray-700 hover:text-gray-900'>
          User Profile
        </Link>
      </div>

      <div className='border-t border-gray-200 my-2'></div>

      <div className='px-3 hover:bg-gray-50 rounded'>
        <Link href="#" onClick={logoutbtn} className='block px-3 py-2 text-gray-700 hover:text-gray-900'>
          Sign Out
        </Link>
      </div>
    </div>
  )
}

export { MenuItems }