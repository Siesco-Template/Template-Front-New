import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { cls } from '@/shared/utils';

import { S_Input } from '@/ui';

import SearchIcon from '../../shared/icons/search.svg?react';
import { SearchBarProps } from '../../types';

export function SearchBar({ onSearch, className }: SearchBarProps) {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('search') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    useEffect(() => {
        setQuery(searchParams.get('search') || '');
    }, [searchParams]);

    return (
        <form onSubmit={handleSubmit} className={cls('relative', className)}>
            <S_Input
                icon={<SearchIcon className="!text-[#919DA8]" width={20} height={20} />}
                iconPosition="left"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Axtar"
            />
        </form>
    );
}
