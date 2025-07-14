import { useState } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import SearchSidebar from './components/SearchSidebar.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import Spinner from './components/Spinner.jsx'
import { FileSearch } from 'lucide-react'
import { motion } from 'framer-motion'

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
  const [error, setError] = useState('');

  // Base URL for the API. During development we fall back to the local
  // Express server, but in production the client and server are typically
  // served from the same origin so we can use a relative path.
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000' : '');

const handleSearch = async () => {
  if (!apiKey) {
    setError('API key is required');
    return;
  }

  setError('');
  setLoading(true);
  const params = { ...query };

  if (action === 'continue' && userCursor) {
    params.next = userCursor;
  }

  try {
    const res = await axios.get(`${API_BASE}/leads`, {
      headers: {
        'x-rapidapi-key': apiKey,
      },
      params,
    });

    const data = res.data;
    const newLeads = (data.people || []).map((person) => ({
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
    }));

    const nextToken = data.next || '';
    setNextCursor(() => nextToken);
    setUserCursor(() => nextToken);
    
    // Always replace leads
    setLeads(newLeads);

  } catch (err) {
    console.error('API request failed:', err);
    setError('Failed to fetch leads');
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans grid grid-cols-1 md:grid-cols-[300px_1fr]">
      <div className="bg-zinc-900 p-6 space-y-6 border-r border-zinc-800">
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
      </div>

<main className="p-10 overflow-y-auto">
  <h1 className="text-4xl font-extrabold mb-8">Leads Scraper and Downloader</h1>

  {error && <p className="mb-4 text-red-400">{error}</p>}

  <h2 className="text-2xl font-bold mb-2 sticky top-0 bg-zinc-950 z-10 py-2">Results</h2>
  
  {leads.length > 0 && (
    <p className="text-sm text-zinc-400 mb-4">Total Leads: {leads.length}</p>
  )}

  {leads.length > 0 ? (
    <ResultsTable
      leads={leads}
      maxHeight="80vh"
      stickyHeader
      striped
      sortable
      expandableRows
    />
  ) : (
    <motion.div
      className="border border-zinc-700 bg-zinc-900 rounded p-6 text-center text-zinc-400 flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FileSearch className="w-12 h-12 mb-3 text-zinc-500 animate-pulse" />
      <p className="text-lg font-medium">No data to display yet.</p>
      <p className="mt-2 text-sm">
        Please perform a new run or continue a previous run to see your leads here.
      </p>
    </motion.div>
  )}

  {/* Unified Action Buttons */}
  <div className="mt-6 flex flex-wrap gap-4">
    <button
      onClick={handleSearch}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow"
    >
      {loading ? <Spinner /> : 'Get Leads Data'}
    </button>
    <button
      onClick={downloadCSV}
      disabled={leads.length === 0}
      className="bg-green-600 disabled:opacity-50 hover:bg-green-700 px-4 py-2 rounded shadow"
    >
      Download CSV
    </button>
    <button
      onClick={downloadExcel}
      disabled={leads.length === 0}
      className="bg-yellow-500 disabled:opacity-50 hover:bg-yellow-600 px-4 py-2 rounded shadow"
    >
      Download Excel
    </button>
  </div>
</main>
    </div>
  );
}
