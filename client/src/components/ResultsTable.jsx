import React from 'react'

export default function ResultsTable({ leads, downloadCSV, downloadExcel }) {
  if (leads.length === 0) return null

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <div className="overflow-auto max-h-[500px] border border-zinc-700 rounded">
        <table className="table-auto w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-zinc-900 z-10">
            <tr>
              {Object.keys(leads[0]).map((key) => (
                <th key={key} className="border border-zinc-700 px-3 py-2">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr key={idx} className="even:bg-zinc-800 hover:bg-zinc-700">
                {Object.values(lead).map((val, i) => (
                  <td key={i} className="border border-zinc-700 px-3 py-2">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 space-x-4">
        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow"
        >
          Download CSV
        </button>
        <button
          onClick={downloadExcel}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded shadow"
        >
          Download Excel
        </button>
      </div>
    </div>
  )
}
