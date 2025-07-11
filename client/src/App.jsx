import { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState({
    qKeywords: 'CEO',
    locations: 'Australia',
    industry: 'technology',
    personTitle: 'CEO',
    numEmployees:
      '1,10;11,20;21,50;51,100;101,200;201,500;501,1000;10001+;5001,10000;2001,5000;1001,2000',
  });
  const [nextCursor, setNextCursor] = useState('');
  const [userCursor, setUserCursor] = useState('');
  const [action, setAction] = useState('new');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const params = { ...query };
    if (action === 'continue' && userCursor) {
      params.next = userCursor;
    }

    try {
      const res = await axios.get('http://localhost:5000/leads', {
        headers: {
          'x-rapidapi-key': apiKey,
        },
        params,
      });
      const data = res.data;
      setNextCursor(data.next || '');
      setLeads(
        (data.people || []).map((person) => ({
          firstName: person.firstName,
          lastName: person.lastName,
          name: person.name,
          title: person.title,
          linkedinUrl: person.linkedinUrl,
          state: person.state,
          city: person.city,
          country: person.country,
          organizationName: person.organizationName,
          organizationWebsiteUrl: person.organizationWebsiteUrl,
          organizationLinkedinUrl: person.organizationLinkedinUrl,
          organizationTwitterUrl: person.organizationTwitterUrl,
          organizationFacebookUrl: person.organizationFacebookUrl,
          organizationPhone: person.organizationPhone,
          organizationAbout: person.organizationAbout,
        }))
      );
    } catch (err) {
      console.error('API request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csv = [
      Object.keys(leads[0] || {}).join(','),
      ...leads.map((row) => Object.values(row).map((val) => `"${val}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `lead-download-${Date.now()}.csv`);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `lead-download-${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans grid grid-cols-[300px_1fr]">
      <aside className="bg-zinc-900 p-6 space-y-6 border-r border-zinc-800">
        <div>
          <h2 className="text-xl font-semibold mb-2">API Settings</h2>
          <input
            type="password"
            placeholder="API Key"
            className="w-full p-2 rounded bg-zinc-800 text-white"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Search Parameters</h2>
          {['qKeywords', 'locations', 'industry', 'personTitle', 'numEmployees'].map((field, idx) => (
            <input
              key={idx}
              placeholder={field.replace(/([a-z])([A-Z])/g, '$1 $2')}
              className="w-full p-2 mb-2 rounded bg-zinc-800 text-white"
              value={query[field]}
              onChange={(e) => setQuery({ ...query, [field]: e.target.value })}
            />
          ))}
        </div>
      </aside>

      <main className="p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold mb-8">Leads Scraper and Downloader</h1>

        <div className="mb-8">
          <label className="font-medium block mb-3 text-lg">Choose Action:</label>
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
                {opt === 'new' ? 'New Run' : opt === 'continue' ? 'Continue from Next Page' : 'Cancel'}
              </label>
            ))}
          </div>
          {action === 'continue' && (
            <input
              placeholder="Next Page Cursor"
              className="mt-4 w-full p-2 rounded bg-zinc-800 text-white"
              value={userCursor}
              onChange={(e) => setUserCursor(e.target.value)}
            />
          )}
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded mb-10 shadow"
          onClick={handleSearch}
          disabled={loading || action === 'cancel'}
        >
          {loading ? 'Fetching...' : 'Get Leads Data'}
        </button>

        {leads.length > 0 && (
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
        )}
      </main>
    </div>
  );
}
