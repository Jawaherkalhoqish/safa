import { useCallback, useEffect, useState } from 'react';
import { getRole } from '@/lib/session';

export function useSession() {
  const [role, setRoleState] = useState(getRole);

  const sync = useCallback(() => setRoleState(getRole()), []);

  useEffect(() => {
    window.addEventListener('safa:role', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('safa:role', sync);
      window.removeEventListener('storage', sync);
    };
  }, [sync]);

  return { role, isVisitor: role === 'visitor', refresh: sync };
}