import React, { useEffect, useState } from 'react';
import DataSection, { normalizeResponse } from './DataSection';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

const formatPrimary = (item) => item?.name || item?.title || item?.activity || `Activity #${item?.id ?? 'n/a'}`;
const formatDetails = (item) =>
  item?.description || item?.date || item?.duration || item?.type || 'No additional details.';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      setActivities(normalizeResponse(payload));
    } catch (fetchError) {
      console.error('[Activities] fetch error:', fetchError);
      setError('Unable to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      console.log('[Activities] REST endpoint:', endpoint);
      if (isMounted) {
        await fetchActivities();
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DataSection
      title="Activities"
      endpoint={endpoint}
      rows={activities}
      loading={loading}
      error={error}
      onRefresh={fetchActivities}
      formatPrimary={formatPrimary}
      formatDetails={formatDetails}
    />
  );
}

export default Activities;