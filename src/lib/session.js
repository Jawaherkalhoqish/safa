const KEY = 'safa_role';

export const ROLES = ['visitor', 'farmer', 'facility', 'admin'];

export const getRole = () => {
  try {
    const r = localStorage.getItem(KEY);
    return ROLES.includes(r) ? r : 'visitor';
  } catch (e) {
    return 'visitor';
  }
};

export const setRole = (role) => {
  try {
    localStorage.setItem(KEY, role);
    window.dispatchEvent(new Event('safa:role'));
  } catch (e) {
    /* ignore */
  }
};

export const isVisitor = () => getRole() === 'visitor';

export const canEdit = () => !isVisitor();