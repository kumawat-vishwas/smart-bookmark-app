'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={loginWithGoogle}
        className="bg-red-500 hover:bg-red-400 hover:cursor-pointer text-white px-6 py-3 rounded-lg"
      >
        Login with Google
      </button>
    </div>
  )
}
