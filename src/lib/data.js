import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const DEFAULT_OPTS = { limit: 200, sort: '-created_date' };

export function useList(entity, query = {}, options = DEFAULT_OPTS, live = false) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qk = JSON.stringify(query);
  const ok = JSON.stringify(options);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities[entity].filter(JSON.parse(qk), JSON.parse(ok));
      setItems(page?.items ?? page ?? []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [entity, qk, ok]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!live) return undefined;
    const unsub = base44.entities[entity].subscribe(() => load());
    return unsub;
  }, [entity, live, load]);

  return { items, loading, error, reload: load, setItems };
}

export function useAggregate(entity, query, groupBy, sum) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const qk = JSON.stringify(query);
  const sumKey = JSON.stringify(sum);

  const load = useCallback(async () => {
    try {
      const res = await base44.entities[entity].aggregate({ query: JSON.parse(qk), groupBy, sum: JSON.parse(sumKey) });
      setRows(res?.rows ?? []);
    } catch (e) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [entity, qk, groupBy, sumKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { rows, loading, reload: load };
}

export function useCount(entity, query = {}) {
  const [value, setValue] = useState(0);
  const qk = JSON.stringify(query);

  const load = useCallback(async () => {
    try {
      const n = await base44.entities[entity].count(JSON.parse(qk));
      setValue(typeof n === 'number' ? n : 0);
    } catch (e) {
      setValue(0);
    }
  }, [entity, qk]);

  useEffect(() => {
    load();
  }, [load]);

  return value;
}

const sumRows = (rows, statuses, field = 'sum_quantity_tons') =>
  rows.filter((r) => statuses.includes(r[Object.keys(r).find((k) => k !== 'count' && k !== 'sum_quantity_tons' && k !== 'sum_estimated_value')])).reduce((a, r) => a + (r[field] || 0), 0);

export function summariseWaste(rows) {
  const byStatus = {};
  (rows || []).forEach((r) => {
    const key = r[Object.keys(r)[0]];
    byStatus[key] = {
      count: r.count || 0,
      tons: r.sum_quantity_tons || 0,
      value: r.sum_estimated_value || 0,
    };
  });
  const tons = (statuses) => statuses.reduce((a, s) => a + (byStatus[s]?.tons || 0), 0);
  const value = (statuses) => statuses.reduce((a, s) => a + (byStatus[s]?.value || 0), 0);
  return { byStatus, tons, value, sumRows };
}