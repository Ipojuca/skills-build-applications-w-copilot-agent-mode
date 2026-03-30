import React, { useEffect, useState } from 'react';
import DataSection, { normalizeResponse } from './DataSection';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

const formatPrimary = (item) => item?.username || item?.name || item?.email || `User #${item?.id ?? 'n/a'}`;
const formatDetails = (item) => item?.email || item?.team || item?.role || 'No additional details.';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      setUsers(normalizeResponse(payload));
    } catch (fetchError) {
      console.error('[Users] fetch error:', fetchError);
      setError('Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      console.log('[Users] REST endpoint:', endpoint);
      if (isMounted) {
        await fetchUsers();
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DataSection
      title="Users"
      endpoint={endpoint}
      rows={users}
      loading={loading}
      error={error}
      onRefresh={fetchUsers}
      formatPrimary={formatPrimary}
      formatDetails={formatDetails}
    />
  );
}

export default Users;