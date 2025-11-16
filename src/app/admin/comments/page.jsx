'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function AdminCommentsPage() {
  const { user, getToken, loading } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchComments()
    }
  }, [user])

  const fetchComments = async () => {
    try {
      setLoadingComments(true)
      const response = await axios.get('/api/admin/comments', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      setComments(response.data.comments)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch comments')
    } finally {
      setLoadingComments(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`/api/admin/comments/${commentId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      setSuccessMessage('Comment deleted successfully')
      fetchComments()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete comment')
    }
  }

  if (loading || loadingComments) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1320]">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-[#0b1320] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Comments Moderation</h1>
            <p className="text-[#abb7c4] mt-2">Manage and moderate user comments</p>
          </div>
          <button
            onClick={fetchComments}
            className="cursor-pointer bg-[#dd003f] hover:bg-[#ff0050] text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="bg-[#020d18] border border-[#233a50] shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-[#233a50]">
            <thead className="bg-[#0b1320]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Film
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Posted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-[#020d18] divide-y divide-[#233a50]">
              {comments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-[#abb7c4] text-lg">No comments to moderate</p>
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-[#0b1320] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#dd003f] flex items-center justify-center text-white font-semibold">
                          {comment.user.name?.charAt(0).toUpperCase() || comment.user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {comment.user.name || 'No name'}
                          </div>
                          <div className="text-sm text-[#abb7c4]">
                            {comment.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/movies/${comment.film.id}`}
                        className="text-sm text-[#dcf836] hover:text-[#e5ff3d] hover:underline max-w-xs truncate block"
                      >
                        {comment.film.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white max-w-md">
                        <p className="line-clamp-3">{comment.content}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-white">
                        {new Date(comment.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="cursor-pointer text-red-500 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {comments.length > 0 && (
          <div className="mt-4 text-sm text-white">
            Total comments: {comments.length}
          </div>
        )}
      </div>
    </div>
  )
}
