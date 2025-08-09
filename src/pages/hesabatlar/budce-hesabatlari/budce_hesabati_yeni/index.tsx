import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

import { detailService } from '@/services/detail/detail.service';
import { excelService } from '@/services/import/export/excel.service';
import { organizationService } from '@/services/organization/organization.service';
import { reportService } from '@/services/report/report.service';

import BottomModal from '@/shared/config/modal/bottomModal';
import { UploadFileIcon } from '@/shared/icons';
import img from '@/shared/images/excel.png';
import { Table } from '@/shared/table';
import { TableProvider } from '@/shared/table/table-context';
import Table_Footer from '@/shared/table/table-footer';
import Table_Header from '@/shared/table/table-header';

import { S_Button, S_Input } from '@/ui';
import { CustomDatePicker } from '@/ui/date-picker';
import S_Select_Simple from '@/ui/select/select-simple';

import ManualEditableTable from '../ManualTable/ManualEditableTable';
import styles from './style.module.css';
import { useTableConfig } from '@/shared/table/tableConfigContext';

type CustomMRTColumn<T extends MRT_RowData> = MRT_ColumnDef<T> & {
    enableSummary?: boolean;
    placeholder?: string;
};

const EditableCell = ({
    row,
    columnKey,
    value,
    editedData,
    setEditedData,
}: {
    row: any;
    columnKey: keyof TableRow;
    value: number;
    editedData: Record<number, Partial<TableRow>>;
    setEditedData: React.Dispatch<React.SetStateAction<Record<number, Partial<TableRow>>>>;
}): JSX.Element => {
    const isParentRow = row.original.isParent;
    const rowKey = row.original.no;

    const [isFocused, setIsFocused] = useState(false);
    const editedValue = editedData[rowKey]?.[columnKey];
    const inputValue = isFocused ? (editedValue?.toString() ?? value.toString()) : (editedValue ?? value)?.toFixed(2);

    if (isParentRow) {
        return <span style={{ display: 'flex', justifyContent: 'end', width: '100%' }}>{value.toFixed(2)}</span>;
    }

    return (
        <input
            type="number"
            step="0.01"
            className={styles.editableInput}
            value={inputValue}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
                setIsFocused(false);
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                    setEditedData((prev) => ({
                        ...prev,
                        [rowKey]: {
                            ...prev[rowKey],
                            [columnKey]: parseFloat(val.toFixed(2)),
                        },
                    }));
                }
            }}
            onChange={(e) => {
                const input = e.target.value;
                setEditedData((prev) => ({
                    ...prev,
                    [rowKey]: {
                        ...prev[rowKey],
                        [columnKey]: input === '' ? undefined : parseFloat(input),
                    },
                }));
            }}
        />
    );
};

interface TableRow {
    no: number;
    title: string;
    code: string;
    estimateAmount: number;
    financingAmount: number;
    checkoutAmount: number;
    actualAmount: number;
    isParent: boolean;
    detailId?: string;
    parentEconomicCode?: string;
}

const transformDetailData = (rawData: any): TableRow[] => {
    let result: TableRow[] = [];
    let counter = 0;
    //  ilk sətir əlavə edilir:
    // result.push({
    //     no: 1,
    //     title: '1',
    //     code: '2',
    //     estimateAmount: 3,
    //     financingAmount: 4,
    //     checkoutAmount: 5,
    //     actualAmount: 6,
    //     isParent: true,
    // });

    for (const parent of rawData.datas) {
        const parentCode = parent.code.toString();

        result.push({
            no: counter++,
            title: parent.title,
            code: parentCode,
            estimateAmount: 0,
            financingAmount: 0,
            checkoutAmount: 0,
            actualAmount: 0,
            isParent: true,
            detailId: parent.id, // Parentin id'sini əlavə et
            parentEconomicCode: '', // Parent üçün kod lazım deyil
        });

        // Hər bir uşaq üçün məlumatları əlavə et
        for (const child of parent.childrens || []) {
            result.push({
                no: counter++, // Nömrə artırılır
                title: child.title,
                code: child.code.toString(),
                estimateAmount: 0,
                financingAmount: 0,
                checkoutAmount: 0,
                actualAmount: 0,
                isParent: false,
                parentEconomicCode: parentCode, // Aid olduğu parentin kodu
                detailId: child.id, // Hər bir uşağın id'sini əlavə et
            });
        }
    }

    return result;
};

const Budce_hesabati_yeni_main = () => {
    const { loadConfigFromApi } = useTableConfig();

    const headerData = [
        { label: 'Əlavə №1', slug: 'elave-1' },
        { label: 'Əlavə №2', slug: 'elave-2' },
        { label: 'Əlavə №3', slug: 'elave-3' },
    ];

    const { slug } = useParams();
    const title = headerData.find((item) => item.slug === slug)?.label || 'Hesabat';

    const navigate = useNavigate();
    const selectRef = useRef<HTMLDivElement | null>(null);
    const [mainWidth, setMainWidth] = useState<string>('200px');

    const [data, setData] = useState<TableRow[]>([]);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<Record<number, Partial<TableRow>>>({});
    const [teskilatOptions, setTeskilatOptions] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [uploadedTableData, setUploadedTableData] = useState<any[]>([]);
    const [uploadedTableColumns, setUploadedTableColumns] = useState<MRT_ColumnDef<any>[]>([]);

    const [showTableOnly, setShowTableOnly] = useState(false);

    const [isAllValid, setIsAllValid] = useState(false);

    const [isExcelImportMode, setIsExcelImportMode] = useState(false);

    const [isValidating, setIsValidating] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // İnzibati təsnifat üzrə kod
    const inzibatiTesnifatOptions = [
        { label: 'Kod 001', value: '001' },
        { label: 'Kod 002', value: '002' },
        { label: 'Kod 003', value: '003' },
    ];

    // Rüb
    const rubOptions = [
        { label: 'I Rüb', value: '1' },
        { label: 'II Rüb', value: '2' },
        { label: 'III Rüb', value: '3' },
        { label: 'IV Rüb', value: '4' },
    ];

    // Funksional təsnifat
    const funksionalTesnifatOptions = [
        { label: 'FT001', value: 'FT001' },
        { label: 'FT002', value: 'FT002' },
        { label: 'FT003', value: 'FT003' },
    ];

    // modal icinde excel faylini secmek ve silmek
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith('.xlsx')) {
            setSelectedFile(file);
            setUploadProgress(0);

            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 300);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadProgress(0);
    };

    // yuxari filter hissenin formdatasi
    const [formData, setFormData] = useState({
        number: '',
        compileDate: '',
        dateRange: '',
        rub: '',
        inzibatiTesnifatCode: '',
        funksionalTesnifat: '',
        organizationId: '',
    });

    const headerFieldOptions: { label: string; value: string }[] = [
        { label: 'Göstəricilər', value: 'Title' },
        { label: 'Xərclərin iqtisadi təsnifat kodları', value: 'Code' },
        { label: 'Hesabat dövrü üçün təsdiq edilmiş smeta məbləği', value: 'EstimateAmount' },
        { label: 'Hesabat dövrü ərzində daxil olmuş maliyyələşmə məbləği', value: 'FinancingAmount' },
        { label: 'Kassa icrası (man)', value: 'CheckoutAmount' },
        { label: 'Faktiki xərc (man)', value: 'ActualAmount' },
    ];
    const headerOptions = ['Title', 'Code', 'EstimateAmount', 'FinancingAmount', 'CheckoutAmount', 'ActualAmount'];
    const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});

    const [validatedRows, setValidatedRows] = useState<
        { records: Record<string, string>; isValid: boolean; errors: Record<string, string[]> }[]
    >([]);

    const [codeToIdMap, setCodeToIdMap] = useState<Map<string, string>>(new Map());

    const [scrollToFirstError, setScrollToFirstError] = useState(false);

    // select optionlar ucun
    useEffect(() => {
        if (selectRef.current) {
            const width = selectRef.current.offsetWidth;
            setMainWidth(`${width}px`);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        loadConfigFromApi();
        setLoading(true);

        detailService
            .getAllDetails()
            .then((res) => {
                const transformed = transformDetailData(res);
                setData(transformed);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));

        organizationService
            .getOrganizationsForSelect()
            .then((res) => {
                const options = res.map((org) => ({
                    label: org.name,
                    value: org.id,
                }));
                setTeskilatOptions(options);
            })
            .catch((err) => console.error('Təşkilatlar alınarkən xəta:', err));
    }, []);

    useEffect(() => {
        const newData = [...data];

        const parents = newData.filter((r) => r.isParent);
        for (const parent of parents) {
            const children = newData.filter((r) => r.parentEconomicCode === parent.code);

            parent.estimateAmount = children.reduce(
                (acc, c) => acc + (editedData[c.no]?.estimateAmount ?? c.estimateAmount),
                0
            );
            parent.financingAmount = children.reduce(
                (acc, c) => acc + (editedData[c.no]?.financingAmount ?? c.financingAmount),
                0
            );
            parent.checkoutAmount = children.reduce(
                (acc, c) => acc + (editedData[c.no]?.checkoutAmount ?? c.checkoutAmount),
                0
            );
            parent.actualAmount = children.reduce(
                (acc, c) => acc + (editedData[c.no]?.actualAmount ?? c.actualAmount),
                0
            );
        }

        setData(newData);
    }, [editedData]);

    const applyDetailIdsToUploadedData = (
        excelData: Record<string, string>[],
        mappings: Record<string, string>,
        rawData: any
    ): Record<string, any>[] => {
        const codeToIdMap = new Map<string, string>();

        // Parent və child-lardan code-id map qur
        for (const parent of rawData.datas) {
            if (parent.code && parent.id) {
                codeToIdMap.set(parent.code.toString(), parent.id);
            }

            for (const child of parent.childrens || []) {
                if (child.code && child.id) {
                    codeToIdMap.set(child.code.toString(), child.id);
                }
            }
        }

        // Mapped field adını tap (yəni excel-dəki "Xərclərin iqtisadi təsnifat kodları" nəyə map olunub)
        const codeColumn = Object.keys(mappings).find((header) => mappings[header]?.toLowerCase() === 'code');

        if (!codeColumn) {
            console.error('Code üçün mapping tapılmadı');
            return excelData;
        }

        // console.log('Kodlar və ID-lər:', Array.from(codeToIdMap.entries()));
        // console.log('Code sütunu:', codeColumn);
        // console.log('Excel row nümunəsi:', excelData[0]);

        // Hər bir sətirə uyğun id-ni əlavə et
        return excelData.map((row) => {
            const code = row[codeColumn];
            const detailId = codeToIdMap.get(code);
            return {
                ...row,
                detailId, // əlavə olunur
            };
        });
    };

    // yeni report yaratma
    const handleSubmit = () => {
        const [startDate, endDate] = formData.dateRange.split(' – ');

        const requiredFields = [
            formData.number,
            formData.compileDate,
            formData.rub,
            formData.inzibatiTesnifatCode,
            formData.funksionalTesnifat,
            formData.organizationId,
        ];

        const hasEmptyField = requiredFields.some((field) => !field || field.trim() === '');

        if (hasEmptyField) {
            toast.error('Zəhmət olmasa bütün xanaları doldurun.');
            return;
        }
        setLoading(true);

        const rowsToSend = isExcelImportMode
            ? convertExcelRecordsToTableRows(uploadedTableData.slice(1, -2), columnMappings)
            : data;

        const payload: any = {
            number: formData.number,
            compileDate: formData.compileDate,
            startDate: '2025-06-12T09:39:57.289Z',
            endDate: '2025-06-12T09:39:57.289Z',
            term: formData.rub,
            organizationId: formData.organizationId,
            classificationCode1: formData.inzibatiTesnifatCode,
            classificationCode2: formData.inzibatiTesnifatCode,
            funtionalClassificationCode: formData.funksionalTesnifat,
            reportDetails: rowsToSend.map((row: any) => {
                const edited = editedData[row.no] || {};
                const code = row.code;
                const detailId = isExcelImportMode ? codeToIdMap.get(code) : row.detailId;

                return {
                    detailId,
                    estimateAmount: edited.estimateAmount ?? row.estimateAmount,
                    financingAmount: edited.financingAmount ?? row.financingAmount,
                    checkoutAmount: edited.checkoutAmount ?? row.checkoutAmount,
                    actualAmount: edited.actualAmount ?? row.actualAmount,
                };
            }),
        };

        setLoading(true);

        reportService
            .createReport(payload)
            .then((res) => {
                console.log('Uğurla göndərildi:', res);
                setLoading(false);
                navigate(-1);
            })
            .catch((err) => {
                console.error('Xəta baş verdi:', err);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false); // Spinner dayansın
            });
    };

    // esas cedvelin sutunlari
    const columns: CustomMRTColumn<TableRow>[] = [
        {
            header: 'Göstəricilər',
            accessorKey: 'title',
            filterVariant: 'text',
            placeholder: 'İl',
            Cell: ({ cell }: any) => <div style={{ margin: '0 auto' }}>{cell.getValue()}</div>,
        },
        {
            header: 'Xərclərin iqtisadi təsnifat kodları',
            accessorKey: 'code',
            filterVariant: 'text',
            placeholder: 'İl',
            Cell: ({ cell }: any) => <div style={{ margin: '0 auto' }}>{cell.getValue()}</div>,
        },
        {
            header: 'Hesabat dövrü üçün təsdiq edilmiş smeta məbləği',
            accessorKey: 'estimateAmount',
            Cell: ({ row }) => (
                <EditableCell
                    row={row}
                    columnKey="estimateAmount"
                    value={row.original.estimateAmount}
                    editedData={editedData}
                    setEditedData={setEditedData}
                />
            ),
        },
        {
            header: 'Hesabat dövrü ərzində daxil olmuş maliyyələşmə məbləği',
            accessorKey: 'financingAmount',
            Cell: ({ row }) => (
                <EditableCell
                    row={row}
                    columnKey="financingAmount"
                    value={row.original.financingAmount}
                    editedData={editedData}
                    setEditedData={setEditedData}
                />
            ),
        },
        {
            header: 'Kassa icrası (man)',
            accessorKey: 'checkoutAmount',
            Cell: ({ row }) => (
                <EditableCell
                    row={row}
                    columnKey="checkoutAmount"
                    value={row.original.checkoutAmount}
                    editedData={editedData}
                    setEditedData={setEditedData}
                />
            ),
        },
        {
            header: 'Faktiki xərc (man)',
            accessorKey: 'actualAmount',
            Cell: ({ row }) => (
                <EditableCell
                    row={row}
                    columnKey="actualAmount"
                    value={row.original.actualAmount}
                    editedData={editedData}
                    setEditedData={setEditedData}
                />
            ),
        },
    ];

    //data refresh
    const handleRefresh = () => {
        setLoading(true);
        detailService
            .getAllDetails()
            .then((res) => {
                const transformed = transformDetailData(res);
                setData(transformed);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    // excel upload
    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true); // loading başladılır
            const response = await excelService.uploadExcelFile(selectedFile);

            const { headers, records } = response;

            const dynamicColumns = headers.map((h: string) => ({
                accessorKey: h,
                header: h.toUpperCase(),
            }));

            setUploadedTableColumns(dynamicColumns);
            setUploadedTableData(records);
            setUploadProgress(100);
            setShowTableOnly(true);

            const defaultMappings: Record<string, string> = {};
            headers.forEach((header: string, i: number) => {
                defaultMappings[header] = headerOptions[i] ?? '';
            });

            setColumnMappings(defaultMappings);
        } catch (error) {
            console.error('Fayl yüklənərkən xəta:', error);
        } finally {
            setIsUploading(false); // loading bitdi
        }
    };

    // exceldeki fayli yoxluyur validasiya cixardir
    const handleValidate = async () => {
        try {
            setIsValidating(true);
            const payload = {
                tableName: 'ReportDetail',
                records: uploadedTableData,
                mappings: columnMappings,
            };

            const response = await excelService.validateExcelData(payload);

            const result = response?.result || response;
            setValidatedRows(result);

            const allValid = result.every((r: any) => r.isValid);
            setIsAllValid(allValid);

            if (!allValid) {
                setScrollToFirstError(true);
                toast.error('Cədvəldə boş və ya xətalı xanalar var. Zəhmət olmasa yoxlayın!');
            } else {
                toast.success('Məlumatlar uğurla təsdiqləndi ');
            }
        } catch (error) {
            toast.error('Validasiya zamanı xəta baş verdi.');
            console.error('Validasiya zamanı xəta:', error);
        } finally {
            setIsValidating(false);
        }
    };

    // excelden gelen datani cevirrik
    const convertExcelRecordsToTableRows = (
        excelData: Record<string, string>[],
        mappings: Record<string, string>
    ): TableRow[] => {
        let counter = 1;
        return excelData.map((record) => {
            const row: Partial<TableRow> = {
                no: counter++,
                isParent: false,
            };

            for (const [header, mappedFieldRaw] of Object.entries(mappings)) {
                const field = mappedFieldRaw.charAt(0).toLowerCase() + mappedFieldRaw.slice(1); // Baş hərfi kiçik
                const rawValue = record[header];

                if (['estimateAmount', 'financingAmount', 'checkoutAmount', 'actualAmount'].includes(field)) {
                    (row as any)[field] = parseFloat(rawValue.replace(',', '.')) || 0;
                } else {
                    (row as any)[field] = rawValue;
                }
            }

            return row as TableRow;
        });
    };

    // excelin cedvelini getirdi table
    const handleConfirmImport = async () => {
        setIsImporting(true);

        try {
            const rawDetailData = await detailService.getAllDetails();
            const enrichedData = applyDetailIdsToUploadedData(uploadedTableData, columnMappings, rawDetailData);

            const map = new Map<string, string>();
            rawDetailData.datas.forEach((p: any) => {
                if (p.code && p.id) map.set(p.code.toString(), p.id);
                (p.childrens || []).forEach((c: any) => {
                    if (c.code && c.id) map.set(c.code.toString(), c.id);
                });
            });
            setCodeToIdMap(map);

            const converted = convertExcelRecordsToTableRows(enrichedData, columnMappings);
            // console.log(converted, 'convered');
            setData(converted);
            setIsExcelImportMode(true);
            setUploadedTableData(enrichedData); // ID-lə zənginləşdirilmiş halı saxla
        } catch (error) {
            // console.error('ID-lərin əlavə olunmasında xəta:', error);
            toast.error('Kodlar sistemdəki detallarla uyğun gəlmir!');
        } finally {
            setTimeout(() => {
                setIsExcelModalOpen(false);
                setIsImporting(false);
            }, 500);
        }
    };

    // istenilen modalin baglanmasi
    const handleCloseModal = () => {
        setIsExcelModalOpen(false);
        setShowTableOnly(false);
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadedTableColumns([]);
        setUploadedTableData([]);
        setColumnMappings({});
        setValidatedRows([]);
        setIsAllValid(false);
        setIsExcelImportMode(false);
    };

    // xananin editi
    const handleCellChange = (rowIdx: number, key: string, value: string) => {
        setUploadedTableData((prev) => {
            const newData = [...prev];
            newData[rowIdx] = { ...newData[rowIdx], [key]: value };
            return newData;
        });
    };

    const parentRowIds = useMemo(() => {
        return data.filter((r) => r.isParent).map((r) => r.no?.toString());
    }, [data]);

    useEffect(() => {
        if (scrollToFirstError) {
            setTimeout(() => setScrollToFirstError(false), 1000); // scroll edildikdən sonra sıfırla
        }
    }, [scrollToFirstError]);
    return (
        <>
            <Table_Header
                columns={[]}
                data={[]}
                title={title}
                onClickCancelBtn={() => navigate(-1)}
                onClickSaveBtn={() => console.log('Yadda saxlandı')}
                onClickSaveandApplyBtn={() => handleSubmit()}
                onRefresh={() => handleRefresh()}
                importFromExcel={() => setIsExcelModalOpen(true)}
                tableVisibiltyColumn={false}
                page="report"
                actions={['exportFile', 'uploadFile']}
            />
            <section className={styles.filterContainer}>
                <div className={styles.gridContainer}>
                    <div className={styles.grid} ref={selectRef}>
                        <S_Input
                            name="number"
                            label="Nömrəsi"
                            placeholder="000001"
                            value={formData.number}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.grid}>
                        <CustomDatePicker
                            label="Tərtib tarixi"
                            value={formData.compileDate}
                            onSelectedDate={(date) => setFormData({ ...formData, compileDate: date })}
                        />
                        {/* <DateRangePicker value={value} onChange={setValue}  /> */}
                    </div>
                    <div className={styles.grid}>
                        <S_Select_Simple
                            name="rub"
                            label="Rüb"
                            items={rubOptions}
                            value={[formData.rub]}
                            setSelectedItems={(items) =>
                                handleChange({ target: { name: 'rub', value: items[0].value } } as any)
                            }
                            placeholder="Seçin"
                            itemsContentMinWidth={mainWidth}
                        />
                    </div>
                    <div className={styles.grid}>
                        <S_Select_Simple
                            name="inzibatiTesnifatCode"
                            label="İnzibati təsnifat kodu"
                            items={inzibatiTesnifatOptions}
                            value={[formData.inzibatiTesnifatCode]}
                            setSelectedItems={(items) =>
                                handleChange({ target: { name: 'inzibatiTesnifatCode', value: items[0].value } } as any)
                            }
                            placeholder="Seçin"
                            itemsContentMinWidth={mainWidth}
                        />
                    </div>
                    <div className={styles.grid}>
                        <S_Select_Simple
                            name="inzibatiTesnifatCodee"
                            label="İnzibat təsnifat üzrə kod*"
                            items={inzibatiTesnifatOptions}
                            // value={[formData.inzibatiTesnifatCode]}
                            setSelectedItems={(items) =>
                                handleChange({ target: { name: 'inzibatiTesnifatCode', value: items[0].value } } as any)
                            }
                            placeholder="Seçin"
                            disabled
                            itemsContentMinWidth={mainWidth}
                        />
                    </div>
                    <div className={styles.grid}>
                        <S_Select_Simple
                            name="organizationId"
                            label="Təşkilatın adı"
                            items={teskilatOptions}
                            value={[formData.organizationId]}
                            setSelectedItems={(items) =>
                                handleChange({ target: { name: 'organizationId', value: items[0].value } } as any)
                            }
                            placeholder="Seçin"
                            itemsContentMinWidth={mainWidth}
                        />
                    </div>
                    <div className={styles.grid}>
                        <S_Select_Simple
                            name="funksionalTesnifat"
                            label="Funksional təsnifat"
                            items={funksionalTesnifatOptions}
                            value={[formData.funksionalTesnifat]}
                            setSelectedItems={(items) =>
                                handleChange({ target: { name: 'funksionalTesnifat', value: items[0].value } } as any)
                            }
                            placeholder="Seçin"
                            itemsContentMinWidth={mainWidth}
                        />
                    </div>
                </div>
            </section>
            <div className={styles.tableArea}>
                <div className={styles.tableScrollWrapper}>
                    <Table
                        columns={columns}
                        data={data}
                        enableColumnResizing={false}
                        enableMultiSelect={false}
                        enableColumnOrdering={false}
                        enableColumnFilter={false}
                        enableColumnActionsCustom={false}
                        getRowId={(row) => row.no?.toString()}
                        highlightedRowIds={parentRowIds}
                        tableKey="customer_table"
                        isLoading={loading}
                    />
                </div>
                {/* <Table_Footer totalItems={20} /> */}
            </div>

            <BottomModal isOpen={isExcelModalOpen} onClose={handleCloseModal} title="Məlumatları daxil edin">
                <div className={styles.excelModalWrapper}>
                    {!showTableOnly ? (
                        <>
                            <h1>Məlumatları daxil edin</h1>
                            <p className={styles.modalDescription}>
                                .xlsx faylını buraya əlavə edin və maksimum 1 ədəd fayl yükləyə bilərsiniz
                            </p>

                            <div className={styles.dropZone}>
                                <div className={styles.uploadIcon} onClick={() => fileInputRef.current?.click()}>
                                    <UploadFileIcon color="hsl(var(--clr-primary-500))" />
                                    <p>Faylı sürüklə (.xlsx fayl)</p>
                                    <span>və ya</span>
                                    <button className={styles.selectBtn}>Kompüterdən əlavə et</button>{' '}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept=".xlsx"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            {selectedFile && (
                                <div className={styles.fileInfoBox}>
                                    <div className={styles.fileHeader}>
                                        <div className={styles.fileLeft}>
                                            <img src={img} alt="excel" width={24} />
                                            <span className={styles.file}>
                                                <span className={styles.fileName}>{selectedFile.name}</span>
                                                <span className={styles.fileSize}>
                                                    {(selectedFile.size / 1024).toFixed(0)}kb
                                                </span>
                                            </span>
                                        </div>
                                        <button className={styles.removeBtn} onClick={handleRemoveFile}>
                                            ×
                                        </button>
                                    </div>
                                    <div className={styles.progressBarWrapper}>
                                        <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                </div>
                            )}

                            {selectedFile && (
                                <div className={styles.modalFooter}>
                                    <span>
                                        {selectedFile ? (
                                            <>
                                                <span className={styles.highlightNumber}>1</span> fayl seçildi
                                            </>
                                        ) : (
                                            'Heç bir fayl seçilməyib'
                                        )}
                                    </span>
                                    <div className={styles.btnGroup}>
                                        <S_Button variant="outlined-20" onClick={handleCloseModal}>
                                            Ləğv et
                                        </S_Button>
                                        <S_Button
                                            variant="main-20"
                                            disabled={!selectedFile || uploadProgress < 100 || isUploading}
                                            onClick={handleUpload}
                                        >
                                            {isUploading ? <span className={styles.spinner} /> : 'Təsdiqlə'}
                                        </S_Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    alignItems: 'center',
                                }}
                            >
                                <h1>Məlumatları daxil edin</h1>
                            </div>
                            <div style={{ height: '85vh', paddingBottom: '40px' }}>
                                <ManualEditableTable
                                    columns={uploadedTableColumns
                                        .map((c) => c.accessorKey)
                                        .filter((key): key is string => typeof key === 'string')}
                                    data={uploadedTableData}
                                    onChange={handleCellChange}
                                    headerOptions={headerFieldOptions}
                                    columnMappings={columnMappings}
                                    validationResults={validatedRows}
                                    setColumnMappings={setColumnMappings}
                                    scrollToFirstError={scrollToFirstError}
                                />
                            </div>
                            <div className={styles.modalFooter}>
                                <div></div>
                                <div className={styles.btnGroup}>
                                    <S_Button variant="outlined-20" onClick={handleCloseModal}>
                                        {' '}
                                        Ləğv et
                                    </S_Button>
                                    <S_Button
                                        variant="main-20"
                                        onClick={isAllValid ? handleConfirmImport : handleValidate}
                                        disabled={isValidating || isImporting}
                                    >
                                        {isValidating || isImporting ? (
                                            <span className={styles.spinner} />
                                        ) : isAllValid ? (
                                            'Yüklə'
                                        ) : (
                                            'Yoxla'
                                        )}
                                    </S_Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </BottomModal>
        </>
    );
};

export default function Budce_hesabati_yeni() {
    return (
        <TableProvider tableKey="customer_table">
                <Budce_hesabati_yeni_main />
        </TableProvider>
    );
}
