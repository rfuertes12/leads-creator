import { useState } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import SearchSidebar from './components/SearchSidebar.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import Spinner from './components/Spinner.jsx'

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
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const handleSearch = async () => {
    if (!apiKey) {
      setError('API key is required')
      return
    }
    setError('')
    setLoading(true)
    const params = { ...query }
    if (action === 'continue' && userCursor) {
      params.next = userCursor
    }

    try {
      const res = await axios.get(`${API_BASE}/leads`, {
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
      console.error('API request failed:', err)
      setError('Failed to fetch leads')
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans grid grid-cols-1 md:grid-cols-[300px_1fr]">
      <SearchSidebar
        apiKey={apiKey}
        setApiKey={setApiKey}
        query={query}
        setQuery={setQuery}
        action={action}
        setAction={setAction}
        userCursor={userCursor}
        setUserCursor={setUserCursor}
      />

      <main className="p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold mb-8">Leads Scraper and Downloader</h1>

        {error && <p className="mb-4 text-red-400">{error}</p>}

        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded mb-10 shadow flex items-center"
          onClick={handleSearch}
          disabled={loading || action === 'cancel'}
        >
          {loading ? <Spinner /> : 'Get Leads Data'}
        </button>

        <ResultsTable leads={leads} downloadCSV={downloadCSV} downloadExcel={downloadExcel} />
      </main>
    </div>
  )
}
