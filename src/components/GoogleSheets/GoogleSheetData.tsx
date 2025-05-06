import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import FormUpdateSheet from "./FormUpdateSheet";
import {
  Button,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Table,
  Typography,
} from "antd";
import { useGoogleApi } from "../GoogleLoginApiProvider";

interface SheetData {
  range: string;
  majorDimension: string;
  values: string[][];
}

function GoogleSheetData() {
  const { isSignedIn } = useGoogleApi();
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [dateList, setDateList] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [searchData, setSearchData] = useState<{ name: string }>({ name: "" });

  //
  const dataList = useMemo(() => {
    const arr = [...sheetData.slice(1)];
    return arr.filter((row) => row[1].includes(searchData.name)); // Filter rows based on searchData.name
  }, [JSON.stringify(searchData), sheetData.toString()]);

  // Helper function to convert column index to letter (supports multi-letter columns)
  const getColumnLetter = (colIndex: number): string => {
    let columnName = "";
    while (colIndex >= 0) {
      columnName = String.fromCharCode((colIndex % 26) + 65) + columnName; // Convert number to letter
      colIndex = Math.floor(colIndex / 26) - 1; // Move to the next digit in base-26
    }
    return columnName;
  };
  const columnsWidth = [
    120, 120, 180, 180, 180, 180, 180, 180, 180, 280, 180, 180, 280, 180, 280,
    180, 180, 180, 280, 180, 180, 180, 180,
  ];
  const columns = sheetData[0]?.map((col, index) => {
    const key = `col-${index}`;
    return {
      title: col
        ? `${col} ${getColumnLetter(index)} ${index}`
        : `Column ${index}`,
      dataIndex: key,
      key,
      width: columnsWidth[index], // Set a fixed width
      render: (value: string, _: any, rowIndex: number) => {
        // Column 4 (index 3): render HTML
        if (index === 3 && value) {
          return <div dangerouslySetInnerHTML={{ __html: value }} />;
        }

        // Column 16 (index 15): embed Drive preview
        if (index === 15 && value) {
          return (
            <embed
              style={{ width: "100px", height: "50px" }}
              src={`https://drive.google.com/file/d/${value}/preview`}
            />
          );
        }

        return value;
      },
    };
  });

  const dataSource = dataList.map((row, rowIndex) => {
    const rowObject: Record<string, string> = { key: String(rowIndex) };

    row.forEach((cell, cellIndex) => {
      rowObject[`col-${cellIndex}`] = cell;
    });

    return rowObject;
  });

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
            rowCopy.push("");
          }
          return rowCopy;
        });
        setSheetData(normalizedData); // Set the sheet data
        setLoading(false); // Set loading to false
      })
      .catch((err) => {
        console.error("err:", err);
        // setError("Error fetching data from Google Sheets");
        setLoading(false);
      });
  };

  // start function
  useEffect(() => {
    getSheets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Drawer
        title="Basic Drawer"
        placement={"right"}
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key={"right"}
        width={500}
      >
        <FormUpdateSheet count={dataList.length} />
      </Drawer>
      <Row>
        <Col xs={24} sm={18}>
          <Typography.Title level={3}>Search</Typography.Title>
          <Form layout="horizontal">
            <Form.Item label="Insect Name">
              <Input
                name="name"
                value={searchData.name}
                onChange={(e) =>
                  setSearchData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter insect name"
              />
            </Form.Item>
          </Form>
        </Col>
        <Col flex={"auto"}>
          {isSignedIn && (
            <Flex justify="end">
              <Button
                color="cyan"
                variant="solid"
                onClick={() => setOpen(true)}
              >
                Add Insect
              </Button>
            </Flex>
          )}
        </Col>
      </Row>
      <hr />
      <div className="table-listing-container">
        <div className="table-listing-content">
          {!loading && (
            <Table
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: "max-content", y: "66vh" }}
              bordered
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleSheetData;
