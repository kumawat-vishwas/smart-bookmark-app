'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Bookmark = {
  id: string
  title: string
  url: string
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const fetchBookmarks = async () => {
    const { data } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false })
    if (data) setBookmarks(data)
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/')
      } else {
        setUser(data.session.user)
      }
    }

    checkUser()
    fetchBookmarks()

    const channel = supabase
      .channel('bookmarks-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) return

    // Insert bookmark in DB
    const { data, error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]).select('*')

    // Optimistically update UI
    if (data && !error) {
      setBookmarks((prev) => [data[0], ...prev])
    }

    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-gray-900 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-white">Hi,</span>
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  {user.user_metadata?.name?.[0] || user.email?.[0] || '?'}
                </div>
              )}
              <span className="text-white font-semibold">{user.user_metadata?.name || user.email}</span>
            </div>
          )}
          <button onClick={logout} className="text-red-500 hover:cursor-pointer hover:text-red-400 ml-4">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={addBookmark} className="flex gap-2 mb-4">
        <input
          className="bg-gray-950 p-2 flex-1 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="bg-gray-950 p-2 flex-1 rounded"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button className="bg-gray-700 text-white px-4 rounded hover:cursor-pointer hover:bg-gray-600">
          Add
        </button>
      </form>

      <ul>
        {bookmarks.map((b) => (
          <li key={b.id} className="flex justify-between p-2 border-b">
            <a href={b.url} target="_blank" className="text-blue-600 hover:text-blue-500">
              <div className="flex gap-2">
                <p>{b.title} - {b.url}</p>
                <p>
                  <svg xmlns="http://www.w3.org/2000/svg"  
                  width="15px"
                  height="15px"
                  ext-rendering="geometricPrecision" viewBox="0 0 509 511.54"><path  fill="blue" d="M447.19 347.03c0-17.06 13.85-30.91 30.91-30.91 17.05 0 30.9 13.85 30.9 30.91v87.82c0 21.08-8.63 40.29-22.51 54.18-13.88 13.88-33.09 22.51-54.18 22.51H76.69c-21.09 0-40.3-8.63-54.18-22.51C8.63 475.14 0 455.93 0 434.85V76.69c0-21.09 8.63-40.3 22.51-54.18C36.39 8.63 55.6 0 76.69 0h86.98c17.06 0 30.9 13.85 30.9 30.9 0 17.06-13.84 30.91-30.9 30.91H76.69c-4.07 0-7.82 1.69-10.51 4.37-2.68 2.69-4.37 6.44-4.37 10.51v358.16c0 4.06 1.69 7.82 4.37 10.5 2.69 2.68 6.44 4.38 10.51 4.38h355.62c4.07 0 7.82-1.7 10.51-4.38 2.68-2.68 4.37-6.44 4.37-10.5v-87.82zm0-243.56L308.15 244.28c-11.91 12.12-31.45 12.28-43.56.37-12.11-11.91-12.28-31.45-.37-43.56L401.77 61.81H309.7c-17.06 0-30.9-13.85-30.9-30.91 0-17.05 13.84-30.9 30.9-30.9h168.4C495.15 0 509 13.85 509 30.9v165.04c0 17.06-13.85 30.9-30.9 30.9-17.06 0-30.91-13.84-30.91-30.9v-92.47z"/>
                  </svg>
                </p>
                </div>
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 hover:cursor-pointer hover:text-red-400"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
