'use client'
import {useState} from "react";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ProfileInfoForm from "./components/forms/ProfileInfoForm"
import UpdatePasswordForm from "./components/forms/UpdatePassword"
// Theme colors - Tailwind classes like bg-white, etc. use theme colors via CSS variables
import { themeColors } from '@/theme'

export default function UserProfile () {

     const [btnLoading, setBtnLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
          name: '',
          email: ''
        },
    
        validationSchema: Yup.object({
          name: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email address').required('Required')
        }),
    
        onSubmit: async (values) => {
            console.log(values)
        },
      })

    return(
        <div>
            <h3 style={{fontSize: 25, fontWeight: "bolder", marginBottom: "10px"}}>User Profile</h3>
            <div className="card bg-white shadow-md rounded-lg p-4">
                <h1 style={{fontSize: 20, fontWeight: "bolder", marginBottom: 20}}>Profile Info</h1>
                <ProfileInfoForm />
            </div>

            <div className="card bg-white shadow-md rounded-lg p-4 mt-8">
                <h1 style={{fontSize: 20, fontWeight: "bolder", marginBottom: 20}}>Update Password</h1>
                <UpdatePasswordForm />
            </div>
        </div>
    )
}