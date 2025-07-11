import React from 'react'
import {
  KeyRound,
  MapPin,
  Building2,
  Briefcase,
  Users
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const SEARCH_FIELDS = [
  { key: 'qKeywords', label: 'Keywords', placeholder: 'CEO', icon: <KeyRound className="w-4 h-4 mr-2 text-zinc-400" /> },
  { key: 'locations', label: 'Locations', placeholder: 'Australia', icon: <MapPin className="w-4 h-4 mr-2 text-zinc-400" /> },
  { key: 'industry', label: 'Industry', placeholder: 'technology', icon: <Building2 className="w-4 h-4 mr-2 text-zinc-400" /> },
  { key: 'personTitle', label: 'Person Title', placeholder: 'CEO', icon: <Briefcase className="w-4 h-4 mr-2 text-zinc-400" /> },
  { key: 'numEmployees', label: 'Number of Employees', placeholder: '1,10;11,20;21,50', icon: <Users className="w-4 h-4 mr-2 text-zinc-400" /> },
];

export default function SearchSidebar({
  apiKey,
  setApiKey,
  query,
  setQuery,
  action,
  setAction,
  userCursor,
  setUserCursor,
}) {
  return (
    <aside className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* API Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-2">API Settings</h2>
          <label className="block text-sm mb-1" htmlFor="apiKey">
            API Key <span title="Your Apollo API key used to authenticate requests." className="text-zinc-500 cursor-help">(?)</span>
          </label>
          <input
            id="apiKey"
            type="password"
            placeholder="Enter API Key"
            className="w-full p-2 rounded border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <hr className="border-zinc-700 my-4" />

        {/* Search Parameters */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Search Parameters</h2>
          {SEARCH_FIELDS.map(({ key, label, placeholder, icon }) => (
            <div key={key} className="mb-3">
              <label className="block text-sm mb-1" htmlFor={key}>{label}</label>
              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded px-2">
                {icon}
                <input
                  id={key}
                  placeholder={placeholder}
                  className="w-full p-2 bg-transparent text-white focus:outline-none"
                  value={query[key]}
                  onChange={(e) => setQuery({ ...query, [key]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>

        <hr className="border-zinc-700 my-4" />

        {/* Action Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Action</h2>
          <div className="space-y-2">
            {['new', 'continue', 'cancel'].map((opt) => (
              <label
                key={opt}
                className={`block px-3 py-2 rounded cursor-pointer transition-all duration-150 ${
                  action === opt ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="action"
                  value={opt}
                  checked={action === opt}
                  onChange={() => setAction(opt)}
                  className="mr-2 accent-blue-600"
                />
                {opt === 'new'
                  ? 'New Run'
                  : opt === 'continue'
                  ? 'Continue from Next Page'
                  : 'Cancel'}
              </label>
            ))}
          </div>

          {/* Cursor Input */}
          <AnimatePresence>
            {action === 'continue' && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <label className="block text-sm mb-1" htmlFor="nextCursor">
                  Next Page Cursor
                </label>
                <input
                  id="nextCursor"
                  placeholder="Next Page Cursor"
                  className="w-full p-2 rounded border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userCursor}
                  onChange={(e) => setUserCursor(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
