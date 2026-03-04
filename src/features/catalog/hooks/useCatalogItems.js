import { useState, useEffect } from 'react';
import { getCatalogData } from '../services/catalogApi';

export const useCatalogItems = () => {
    const [data, setData] = useState({ categories: [], products: [] });
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const result = await getCatalogData();
                if (isMounted) {
                    setData(result);
                    setStatus('ready');
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setStatus('error');
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    return { ...data, status, error };
};