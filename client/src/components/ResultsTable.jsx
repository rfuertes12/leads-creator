import React, { useState } from 'react'

export default function ResultsTable({
  leads,
  maxHeight = '70vh'
}) {
  const [expandedRows, setExpandedRows] = useState({})

  if (leads.length === 0) return null

  const toggleExpand = (idx) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const allKeys = Object.keys(leads[0])
  const primaryKeys = allKeys.slice(0, 9)
  const extraKeys = allKeys.slice(9)

  return (
    <div>
      <div
        className="overflow-auto border border-zinc-700 rounded"
        style={{ maxHeight }}
      >
        <table className="table-auto w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-zinc-900 z-10">
            <tr>
              {primaryKeys.map((key) => (
                <th
                  key={key}
                  className="border border-zinc-700 px-3 py-2 text-left bg-zinc-800"
                >
                  {key}
                </th>
              ))}
              <th className="border border-zinc-700 px-3 py-2 text-left bg-zinc-800">Details</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <React.Fragment key={idx}>
                <tr className="even:bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  {primaryKeys.map((key, i) => (
                    <td key={i} className="border border-zinc-700 px-3 py-2">
                      {lead[key]}
                    </td>
                  ))}
                  <td
                    className="border border-zinc-700 px-3 py-2 text-blue-400 hover:underline cursor-pointer"
                    onClick={() => toggleExpand(idx)}
                  >
                    {expandedRows[idx] ? 'Show Less' : 'Show More'}
                  </td>
                </tr>
                {expandedRows[idx] && (
                  <tr className="bg-zinc-900 text-sm text-zinc-300">
                    <td
                      colSpan={primaryKeys.length + 1}
                      className="border border-zinc-700 px-4 py-3"
                    >
                      <ul className="list-disc pl-5 space-y-1">
                        {extraKeys.map((key) => (
                          <li key={key}>
                            <span className="font-semibold text-white">{key}:</span>{' '}
                            {lead[key] || <span className="italic text-zinc-500">N/A</span>}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
