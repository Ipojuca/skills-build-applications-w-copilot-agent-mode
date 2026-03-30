import React, { useEffect, useState } from 'react';
import DataSection, { normalizeResponse } from './DataSection';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/';

const formatPrimary = (item) => item?.name || item?.title || item?.workout_type || `Workout #${item?.id ?? 'n/a'}`;
const formatDetails = (item) => item?.difficulty || item?.duration || item?.muscle_group || 'No additional details.';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkouts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      setWorkouts(normalizeResponse(payload));
    } catch (fetchError) {
      console.error('[Workouts] fetch error:', fetchError);
      setError('Unable to load workouts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      console.log('[Workouts] REST endpoint:', endpoint);
      if (isMounted) {
        await fetchWorkouts();
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DataSection
      title="Workouts"
      endpoint={endpoint}
      rows={workouts}
      loading={loading}
      error={error}
      onRefresh={fetchWorkouts}
      formatPrimary={formatPrimary}
      formatDetails={formatDetails}
    />
  );
}

export default Workouts;