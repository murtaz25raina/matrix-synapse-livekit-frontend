interface LocalStorageItem {
  key: string;
  value: string;
}

export const getLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (
  items: LocalStorageItem | LocalStorageItem[]
): void => {
  const setItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };

  if (Array.isArray(items)) {
    items.forEach((item) => {
      setItem(item.key, item.value);
    });
  } else {
    setItem(items.key, items.value);
  }
};

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
