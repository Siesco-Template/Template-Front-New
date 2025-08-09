import { useEffect, useState } from 'react';

export const useQuery = ({ key, fn, initial, then, onSuccess, catch: onError, retry = 0 }: any) => {
    const [data, setData] = useState(initial.data);
    const [loading, setLoading] = useState(initial.loading);
    const [error, setError] = useState(null);

    const fetchData = async (attempt = 0) => {
        setLoading('pending');
        try {
            const result = await fn();
            const processedData = then ? then(result) : result;
            setData(processedData);
            onSuccess?.(processedData);
            setLoading('success');
        } catch (err: any) {
            if (attempt < retry) fetchData(attempt + 1);
            else {
                setError(err);
                onError?.(err);
                setLoading('error');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [key]);

    return { data, error, loading, refetch: fetchData };
};
