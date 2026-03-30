import React, { useEffect, useState } from 'react';
import DataSection, { normalizeResponse } from './DataSection';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

const formatPrimary = (item) => item?.name || item?.username || item?.user || `Entry #${item?.id ?? 'n/a'}`;
const formatDetails = (item) => {
  const score = item?.score ?? item?.points;
  const rank = item?.rank;

  if (score !== undefined && rank !== undefined) {
    return `Score: ${score} | Rank: ${rank}`;
  }

  if (score !== undefined) {
    return `Score: ${score}`;
  }

  return 'No additional details.';
};

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      setEntries(normalizeResponse(payload));
    } catch (fetchError) {
      console.error('[Leaderboard] fetch error:', fetchError);
      setError('Unable to load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      console.log('[Leaderboard] REST endpoint:', endpoint);
      if (isMounted) {
        await fetchLeaderboard();
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DataSection
      title="Leaderboard"
      endpoint={endpoint}
      rows={entries}
      loading={loading}
      error={error}
      onRefresh={fetchLeaderboard}
      formatPrimary={formatPrimary}
      formatDetails={formatDetails}
    />
  );
}

export default Leaderboard;