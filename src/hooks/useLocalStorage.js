import { useState, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        setStoredValue((currValue) => {
            try {
                const valueToStore = value instanceof Function ? value(currValue) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            } catch (error) {
                console.error(error);
                return currValue;
            }
        });
    }, [key]);

    return [storedValue, setValue];
};
