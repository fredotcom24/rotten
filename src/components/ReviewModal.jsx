'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function ReviewModal({ isOpen, onClose, onSubmit, initialContent = '', isEditing = false }) {
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (content.trim().length === 0) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please write a review before submitting",
        icon: "alert",
        confirmButtonColor: "#ff3535d3"
    });
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setContent(initialContent)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#020d18] rounded-lg shadow-2xl w-full max-w-2xl mx-4 border border-[#233a50]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#233a50]">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit your review comment' : 'Write a review comment'}
          </h2>
          <button
            onClick={handleCancel}
            className="cursor-pointer text-[#abb7c4] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="review-content" className="block text-[#abb7c4] mb-2 text-sm font-medium">
              Your review comment
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              rows={8}
              className="w-full bg-[#0b1320] text-white border border-[#233a50] rounded-md px-4 py-3 focus:outline-none focus:border-[#dd003f] focus:ring-1 focus:ring-[#dd003f] resize-none placeholder-[#405266]"
              disabled={isSubmitting}
            />
            <p className="mt-2 text-sm text-[#abb7c4]">
              {content.length} characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="cursor-pointer px-6 py-2.5 bg-[#233a50] hover:bg-[#2d4a63] text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || content.trim().length === 0}
              className="cursor-pointer px-6 py-2.5 bg-[#dd003f] hover:bg-[#ff0050] text-white rounded-md font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditing ? 'Update' : 'Publish'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
