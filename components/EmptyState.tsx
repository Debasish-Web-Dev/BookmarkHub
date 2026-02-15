/**
 * Empty State Component
 * Displayed when user has no bookmarks yet
 */

'use client'

import { motion } from 'framer-motion'

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Icon */}
      <div className="mb-6 text-purple-300">
        <svg
          className="w-24 h-24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>

      {/* Text */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        No bookmarks yet
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        Start organizing your favorite links by adding your first bookmark above.
      </p>
    </motion.div>
  )
}
