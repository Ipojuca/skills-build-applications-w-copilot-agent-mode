import React, { useMemo, useState } from 'react';

function normalizeResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

function DataSection({
  title,
  endpoint,
  rows,
  loading,
  error,
  onRefresh,
  formatPrimary,
  formatDetails,
}) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredRows = useMemo(() => {
    if (!query.trim()) {
      return rows;
    }

    const lowerQuery = query.toLowerCase();
    return rows.filter((row) => {
      const primary = formatPrimary(row).toLowerCase();
      const details = formatDetails(row).toLowerCase();
      return primary.includes(lowerQuery) || details.includes(lowerQuery);
    });
  }, [rows, query, formatPrimary, formatDetails]);

  return (
    <section className="card entity-card">
      <header className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="h4 mb-1">{title}</h2>
          <p className="text-secondary small mb-0">Consistent table layout with Bootstrap components.</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <a className="link-primary text-nowrap" href={endpoint} target="_blank" rel="noreferrer">
            Open API
          </a>
          <button className="btn btn-primary btn-sm" type="button" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </header>

      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-md-6 col-lg-5">
            <label htmlFor={`${title}-search`} className="form-label fw-semibold mb-1">
              Search
            </label>
            <input
              id={`${title}-search`}
              type="search"
              className="form-control"
              placeholder={`Filter ${title.toLowerCase()}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </form>

        {loading && <div className="alert alert-info">Loading {title.toLowerCase()}...</div>}
        {!loading && error && <div className="alert alert-danger mb-0">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle entity-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '70px' }}>
                    #
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Details</th>
                  <th scope="col" className="text-end" style={{ width: '130px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((item, index) => (
                  <tr key={item?.id ?? `${title}-${index}`}>
                    <th scope="row">{index + 1}</th>
                    <td>{formatPrimary(item)}</td>
                    <td>{formatDetails(item)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length === 0 && <p className="mb-0">No matching records found.</p>}
          </div>
        )}
      </div>

      <footer className="card-footer small text-secondary">
        {rows.length} total record(s)
      </footer>

      {selectedItem && (
        <>
          <div className="modal fade show d-block entity-modal" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="h5 modal-title mb-0">{formatPrimary(selectedItem)}</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedItem(null)}
                  />
                </div>
                <div className="modal-body">
                  <p className="mb-0">{formatDetails(selectedItem)}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </section>
  );
}

export { normalizeResponse };
export default DataSection;
