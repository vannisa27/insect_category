import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import FormUpdateSheet from './FormUpdateSheet';
import { Button, Col, Drawer, Empty, Flex, Form, Input, Pagination, PaginationProps, Row, Table, TableColumnsType, Typography } from 'antd';
import { useGoogleApi } from '../GoogleLoginApiProvider';
import { CardAnimal } from '../CardAnimal';
import styled from 'styled-components';

interface SheetData {
    range: string;
    majorDimension: string;
    values: string[][];
}

export type DataObject = {
    key?: React.Key;
    orderNumber: string; // index:0 ลำดับที่
    code: string; // index:1 รหัส
    insectName: string; // index:2 ชื่อแมลง
    commonName: string; // index:3 ชื่อสามัญ
    scientificName: string; // index:4 ชื่อวิทยาศาสตร์
    family: string; // index:5 วงศ์
    genus: string; // index:6 สกุล
    type: string; // index:7 ประเภท
    order: string; // index:8 อันดับ
    status: string; // index:9 สถานภาพ
    dateFound: string; // index:10 วันที่พบ
    locationFound: string; // index:11 สถานที่พบ
    behavior: string; // index:12 พฤติกรรม
    foundBy: string; // index:13 ผู้พบ
    additionalNotes: string; // index:14 บันทึกเพิ่มเติม
    imageUrl: string; // index:15 รูปภาพ
    dateStuffed: string; // index:16 วันที่สตัฟฟ์
    dateDisplayed: string; // index:17 วันที่จัดแสดง
    dateUndisplayed: string; // index:18 วันที่เลิกจัดแสดง
    displayLocation: string; // index:19 ตำแหน่งจัดแสดง
    stuffedBy: string; // index:20 ผู้สตัฟฟ์
    technique: string; // index:21 เทคนิค
    quantity: string; // index:22 จำนวน(ตัว)
};

const PAGE_SIZE = 10; // Default items per page

function GoogleSheetData() {
    const { isSignedIn } = useGoogleApi();
    const [sheetData, setSheetData] = useState<string[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const [dateList, setDateList] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [searchData, setSearchData] = useState<{ name: string }>({ name: '' });
    const [dataSource, setDataSource] = useState<DataObject[]>([]);
    const [columnsTitle, setColumnsTitle] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    //
    const dataList = useMemo(() => {
        const arr = [...dataSource];
        return arr.filter((f) => f.insectName.includes(searchData.name)); // Filter rows based on searchData.name
    }, [JSON.stringify(searchData), dataSource.toString()]);

    // Helper function to convert column index to letter (supports multi-letter columns)
    const getColumnLetter = (colIndex: number): string => {
        let columnName = '';
        while (colIndex >= 0) {
            columnName = String.fromCharCode((colIndex % 26) + 65) + columnName; // Convert number to letter
            colIndex = Math.floor(colIndex / 26) - 1; // Move to the next digit in base-26
        }
        return columnName;
    };

    // const columns = sheetData[0]?.map((col, index) => {
    //     const key = `col-${index}`;
    //     return {
    //         title: col ? `${col} ${getColumnLetter(index)} ${index}` : `Column ${index}`,
    //         dataIndex: key,
    //         key,
    //         width: columnsWidth[index], // Set a fixed width
    //         render: (value: string, _: any, rowIndex: number) => {
    //             // Column 4 (index 3): render HTML
    //             if (index === 3 && value) {
    //                 return <div dangerouslySetInnerHTML={{ __html: value }} />;
    //             }

    //             // Column 16 (index 15): embed Drive preview
    //             if (index === 15 && value) {
    //                 return <embed style={{ width: '100px', height: '50px' }} src={`https://drive.google.com/file/d/${value}/preview`} />;
    //             }

    //             return value;
    //         },
    //     };
    // });

    // const dataSource = dataList.map((row, rowIndex) => {
    //     const rowObject: Record<string, string> = { key: String(rowIndex) };

    //     row.forEach((cell, cellIndex) => {
    //         rowObject[`col-${cellIndex}`] = cell;
    //     });

    //     return rowObject;
    // });

    const columns: TableColumnsType<DataObject> = [
        {
            title: columnsTitle[0],
            dataIndex: 'orderNumber',
            width: 100,
        },
        {
            title: columnsTitle[1],
            dataIndex: 'code',
            width: 120,
        },
        {
            title: columnsTitle[2],
            dataIndex: 'insectName',
            width: 180,
        },
        {
            title: columnsTitle[3],
            dataIndex: 'commonName',
            width: 180,
        },
        {
            title: columnsTitle[4],
            dataIndex: 'scientificName',
            width: 180,
        },
        {
            title: columnsTitle[5],
            dataIndex: 'family',
            width: 180,
        },
        {
            title: columnsTitle[6],
            dataIndex: 'genus',
            width: 180,
        },
        {
            title: columnsTitle[7],
            dataIndex: 'type',
            width: 180,
        },
        {
            title: columnsTitle[8],
            dataIndex: 'order',
            width: 180,
        },
        {
            title: columnsTitle[9],
            dataIndex: 'status',
            width: 280,
        },
        {
            title: columnsTitle[10],
            dataIndex: 'dateFound',
            width: 180,
        },
        {
            title: columnsTitle[11],
            dataIndex: 'locationFound',
            width: 180,
        },
        {
            title: columnsTitle[12],
            dataIndex: 'behavior',
            width: 280,
        },
        {
            title: columnsTitle[13],
            dataIndex: 'foundBy',
            width: 180,
        },
        {
            title: columnsTitle[14],
            dataIndex: 'additionalNotes',
            width: 280,
        },
        {
            title: columnsTitle[15],
            dataIndex: 'imageUrl',
            width: 180,
        },
        {
            title: columnsTitle[16],
            dataIndex: 'dateStuffed',
            width: 180,
        },
        {
            title: columnsTitle[17],
            dataIndex: 'dateDisplayed',
            width: 180,
        },
        {
            title: columnsTitle[18],
            dataIndex: 'dateUndisplayed',
            width: 280,
        },
        {
            title: columnsTitle[19],
            dataIndex: 'displayLocation',
            width: 180,
        },
        {
            title: columnsTitle[20],
            dataIndex: 'stuffedBy',
            width: 180,
        },
        {
            title: columnsTitle[21],
            dataIndex: 'technique',
            width: 180,
        },
        {
            title: columnsTitle[22],
            dataIndex: 'quantity',
            width: 120,
        },
    ];

    const getSheets = async () => {
        // API URL and your API key
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SHEETS_ID}/values/Sheets1?key=${process.env.REACT_APP_API_KEY}`;

        // Fetch data from Google Sheets
        axios
            .get<SheetData>(apiUrl)
            .then((response) => {
                const data = response.data.values;
                // console.log("data:", data);
                const maxLength = data[0].length; // header length = column length
                const normalizedData = data.map((row) => {
                    const rowCopy = [...row];
                    // Add empty strings for missing columns to match the first row length
                    while (rowCopy.length < maxLength) {
                        rowCopy.push('');
                    }
                    return rowCopy;
                });

                const x = normalizedData.splice(1).map((t, i) => {
                    const n: DataObject = {
                        key: i,
                        orderNumber: t[0],
                        code: t[1],
                        insectName: t[2],
                        commonName: t[3],
                        scientificName: t[4],
                        family: t[5],
                        genus: t[6],
                        type: t[7],
                        order: t[8],
                        status: t[9],
                        dateFound: t[10],
                        locationFound: t[11],
                        behavior: t[12],
                        foundBy: t[13],
                        additionalNotes: t[14],
                        imageUrl: t[15],
                        dateStuffed: t[16],
                        dateDisplayed: t[17],
                        dateUndisplayed: t[18],
                        displayLocation: t[19],
                        stuffedBy: t[20],
                        technique: t[21],
                        quantity: t[22],
                    };

                    return n;
                });

                setColumnsTitle([...normalizedData[0]]);
                setDataSource([...x]);
                setSheetData(normalizedData); // Set the sheet data
                setLoading(false); // Set loading to false
            })
            .catch((err) => {
                console.error('err:', err);
                // setError("Error fetching data from Google Sheets");
                setLoading(false);
            });
    };

    const onChangePage: PaginationProps['onChange'] = (page, size) => {
        setCurrentPage(page);
        setPageSize(size ?? PAGE_SIZE);
    };

    // start function
    useEffect(() => {
        getSheets();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleSheetDataWrapper>
            <Drawer
                title='Basic Drawer'
                placement={'right'}
                closable={false}
                onClose={() => setOpen(false)}
                open={open}
                key={'right'}
                width={500}
            >
                <FormUpdateSheet count={dataList.length} />
            </Drawer>
            <Row>
                <Col xs={24} sm={18}>
                    <Typography.Title level={3}>Search</Typography.Title>
                    <Form layout='horizontal'>
                        <Form.Item label='Insect Name'>
                            <Input
                                name='name'
                                value={searchData.name}
                                onChange={(e) => setSearchData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder='Enter insect name'
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col flex={'auto'}>
                    {isSignedIn && (
                        <Flex justify='end'>
                            <Button color='cyan' variant='solid' onClick={() => setOpen(true)}>
                                Add Insect
                            </Button>
                        </Flex>
                    )}
                </Col>
            </Row>
            <hr />

            {!loading && (
                <>
                    {dataList.length > 0 ? (
                        <div className='table-listing-container'>
                            <div className='table-listing'>
                                <Table columns={columns} dataSource={dataList} scroll={{ x: 'max-content', y: '66vh' }} bordered />
                            </div>
                            <div className='table-listing-card'>
                                <div>
                                    <Flex wrap gap={24} justify='space-around'>
                                        {dataList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => (
                                            <CardAnimal key={index} data={item} />
                                        ))}
                                    </Flex>
                                    <Flex style={{ marginTop: '24px' }} justify='center'>
                                        <Pagination
                                            showSizeChanger
                                            defaultCurrent={1}
                                            total={dataList.length}
                                            onShowSizeChange={onChangePage}
                                            onChange={onChangePage}
                                        />
                                    </Flex>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Empty />
                    )}
                </>
            )}
        </GoogleSheetDataWrapper>
    );
}

const GoogleSheetDataWrapper = styled.div`
    .table-listing-card {
        display: none;
    }

    @media screen and (max-width: 1199px) {
        .table-listing-card {
            display: block;
        }

        .table-listing {
            display: none;
        }
    }
`;

export default GoogleSheetData;
