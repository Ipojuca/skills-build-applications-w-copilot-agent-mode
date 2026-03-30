import React, { useEffect, useState } from 'react';
import DataSection, { normalizeResponse } from './DataSection';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

const formatPrimary = (item) => item?.name || item?.title || `Team #${item?.id ?? 'n/a'}`;
const formatDetails = (item) => item?.captain || item?.members || item?.city || 'No additional details.';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeams = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      setTeams(normalizeResponse(payload));
    } catch (fetchError) {
      console.error('[Teams] fetch error:', fetchError);
      setError('Unable to load teams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      console.log('[Teams] REST endpoint:', endpoint);
      if (isMounted) {
        await fetchTeams();
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DataSection
      title="Teams"
      endpoint={endpoint}
      rows={teams}
      loading={loading}
      error={error}
      onRefresh={fetchTeams}
      formatPrimary={formatPrimary}
      formatDetails={formatDetails}
    />
  );
}

export default Teams;