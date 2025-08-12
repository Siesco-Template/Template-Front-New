import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';

import { MRT_ColumnDef } from 'material-react-table';

import { httpRequest } from '@/services/api/httpsRequest';

import { Catalog } from '.';
import { ExampleModal } from './ExampleModal';

interface Product {
    id: string;
    saleDate: string;
    payDate: string;
    cargoType: string;
    totalAmount: number;
    fllName: string;
    name: string;
    payStatus: number;
    service: string | null;
}

const CatalogExamplePage = () => {
    const [searchParams] = useSearchParams();

    const [singleSelected, setSingleSelected] = useState<Product[]>([]);
    const [multipleSelected, setMultipleSelected] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [data, setData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const fetchData = async () => {
        setIsLoading(true);

        const filterData = JSON.parse(searchParams.get('filterData') || '{}');
        const skip = filterData.skip || 0;
        const take = filterData.take || 20;
        try {
            const res = await httpRequest<{ data: Product[]; totalCount: number }>(
                'https://localhost:7175/api/Sales/GetAllSales',
                {
                    method: 'GET',
                    queryParams: { skip, take },
                }
            );
            if (res) {
                setData(res?.data);
                setTotalCount(res.totalCount);
            }
        } catch {
            // @ts-expect-error
            toast.error(error?.data?.message || 'An error occurred while fetching data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    const tableColumns: MRT_ColumnDef<Product>[] = [
        {
            header: 'Full Name',
            accessorKey: 'fllName',
            id: 'fullName',
            filterVariant: 'text',
            Cell: ({ cell }: any) => <div style={{ textAlign: 'center', marginRight: 'auto' }}>{cell.getValue()}</div>,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            id: 'name',
            filterVariant: 'text',
            Cell: ({ cell }: any) => <div style={{ textAlign: 'center', marginRight: 'auto' }}>{cell.getValue()}</div>,
        },
        {
            header: 'Cargo type',
            accessorKey: 'cargoType',
            id: 'cargoType',
            filterVariant: 'text',
            Cell: ({ cell }: any) => <div style={{ textAlign: 'center', marginRight: 'auto' }}>{cell.getValue()}</div>,
        },
        {
            header: 'Total Amount',
            accessorKey: 'totalAmount',
            id: 'totalAmount',
            filterVariant: 'text',
            Cell: ({ cell }: any) => <div style={{ textAlign: 'center', marginRight: 'auto' }}>{cell.getValue()}</div>,
        },
        {
            header: 'Sale Date',
            accessorKey: 'saleDate',
            id: 'saleDate',
            // @ts-expect-error
            filterVariant: 'date-interval',
            Cell: ({ cell }: any) => {
                const rawValue = cell.getValue();
                const date = rawValue ? new Date(rawValue) : null;

                const formatted =
                    date && !isNaN(date.getTime())
                        ? `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
                        : '';

                return <div>{formatted}</div>;
            },
        },
        {
            header: 'Pay Date',
            accessorKey: 'payDate',
            id: 'payDate',
            // @ts-expect-error
            filterVariant: 'date-interval',
            Cell: ({ cell }: any) => {
                const rawValue = cell.getValue();
                const date = rawValue ? new Date(rawValue) : null;

                const formatted =
                    date && !isNaN(date.getTime())
                        ? `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
                        : '';

                return <div>{formatted}</div>;
            },
        },
    ];

    return (
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
            <div style={{ flex: 1, maxWidth: 300 }}>
                <Catalog<Product>
                    items={data}
                    getLabel={(p) => p.name}
                    value={singleSelected}
                    onChange={(selection) => {
                        setSingleSelected([selection as Product]);
                    }}
                    multiple={false}
                    enableModal={true}
                    getRowId={(p) => {
                        return p?.id?.toString();
                    }}
                    sizePreset="xl"
                    showMoreColumns={tableColumns}
                    totalItemCount={totalCount}
                    onRefetch={fetchData}
                    onClickNew={() => {
                        const homeUrl = window.location.origin + '/';
                        window.open(homeUrl, '_blank', 'noopener,noreferrer');
                    }}
                    isLoading={isLoading}
                />
            </div>

            <div style={{ flex: 1, maxWidth: 300 }}>
                <Catalog<Product>
                    items={data}
                    getLabel={(p) => p.name}
                    value={multipleSelected}
                    onChange={(selection) => {
                        setMultipleSelected(selection as Product[]);
                    }}
                    multiple={true}
                    enableModal={true}
                    getRowId={(p) => {
                        return p?.id?.toString();
                    }}
                    sizePreset="xxl"
                    showMoreColumns={tableColumns}
                    totalItemCount={totalCount}
                    onRefetch={fetchData}
                    onClickNew={() => {
                        setIsModalOpen(true);
                    }}
                    isLoading={isLoading}
                />
            </div>

            <ExampleModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={() => {
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default CatalogExamplePage;
