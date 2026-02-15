/**
 * Bookmark Card Component
 * Displays a single bookmark with delete functionality
 */

'use client'

import { useState } from 'react'
import { Bookmark } from '@/types/bookmark'
import { createClient } from '@/lib/supabase'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  // Handle bookmark deletion
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id)

      if (error) throw error

      toast.success('Bookmark deleted successfully!')
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      toast.error('Failed to delete bookmark')
      setIsDeleting(false)
    }
  }

  // Extract domain from URL for favicon
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return ''
    }
  }

  const domain = getDomain(bookmark.url)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 min-w-0 mr-3">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate group-hover:text-purple-600 transition-colors">
            {bookmark.title}
          </h3>

          {/* URL with favicon */}
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors mb-3"
          >
            {/* Favicon */}
            {domain && (
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                alt=""
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <span className="truncate">{bookmark.url}</span>
            <svg
              className="w-4 h-4 ml-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {/* Created date */}
          <p className="text-xs text-gray-500">
            Added {new Date(bookmark.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Delete button */}
        <motion.button
          onClick={handleDelete}
          disabled={isDeleting}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete bookmark"
        >
          {isDeleting ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
