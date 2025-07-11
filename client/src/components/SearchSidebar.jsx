import React from 'react'

const SEARCH_FIELDS = [
  { key: 'qKeywords', label: 'Keywords', placeholder: 'CEO' },
  { key: 'locations', label: 'Locations', placeholder: 'Australia' },
  { key: 'industry', label: 'Industry', placeholder: 'technology' },
  { key: 'personTitle', label: 'Person Title', placeholder: 'CEO' },
  {
    key: 'numEmployees',
    label: 'Number of Employees',
    placeholder: '1,10;11,20;21,50',
  },
]

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
    <aside className="bg-zinc-900 p-6 space-y-6 border-r border-zinc-800">
      <div>
        <h2 className="text-xl font-semibold mb-2">API Settings</h2>
        <label className="block text-sm mb-1" htmlFor="apiKey">API Key</label>
        <input
          id="apiKey"
          type="password"
          placeholder="Enter API Key"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Search Parameters</h2>
        {SEARCH_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="mb-2">
            <label className="block text-sm mb-1" htmlFor={key}>{label}</label>
            <input
              id={key}
              placeholder={placeholder}
              className="w-full p-2 rounded bg-zinc-800 text-white"
              value={query[key]}
              onChange={(e) => setQuery({ ...query, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Action</h2>
        <div className="space-y-2">
          {['new', 'continue', 'cancel'].map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="action"
                value={opt}
                checked={action === opt}
                onChange={() => setAction(opt)}
                className="mr-2"
              />
              {opt === 'new'
                ? 'New Run'
                : opt === 'continue'
                ? 'Continue from Next Page'
                : 'Cancel'}
            </label>
          ))}
        </div>
        {action === 'continue' && (
          <div className="mt-4">
            <label className="block text-sm mb-1" htmlFor="nextCursor">
              Next Page Cursor
            </label>
            <input
              id="nextCursor"
              placeholder="Next Page Cursor"
              className="w-full p-2 rounded bg-zinc-800 text-white"
              value={userCursor}
              onChange={(e) => setUserCursor(e.target.value)}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
