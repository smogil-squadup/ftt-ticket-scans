"use client";

import { useEffect, useState } from "react";

interface ScanStats {
  scan_count: string;
  total_attendee_count: string;
}

export default function Home() {
  const [data, setData] = useState<ScanStats | null>(null);
  const [queryTime, setQueryTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/query-transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result.data);
      setQueryTime(result.queryTimeMs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Event Scan Statistics
          </h1>
          <p className="text-gray-600 text-center mb-6">Event ID: 115298</p>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        Scan Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Attendee Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-2xl font-semibold text-gray-900 border-r border-gray-300">
                        {data.scan_count || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-2xl font-semibold text-gray-900">
                        {data.total_attendee_count || "0"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {queryTime && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Query executed in {queryTime}ms
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Refresh
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
