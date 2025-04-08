import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { gapi } from "gapi-script";
import FormUpdateSheet from "./FormUpdateSheet";

interface SheetData {
  range: string;
  majorDimension: string;
  values: string[][];
}

type UpdateSheetsData = {
  row?: string,
  B: string,
  C: string,
  D: string,
  E: string,
  F: string,
  G: string,
  H: string,
  I: string,
  J: string,
  K: string,
  L: string,
  M: string,
  N: string,
}


function GoogleSheetData() {
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  // const [dateList, setDateList] = useState<string[]>([]);
  const [employeeList, setEmployeeList] = useState<string[]>([]);
  const [searchData, setSearchData] = useState<{ name: string }>({ name: '' });
  const [updateSheetsData, setUpdateSheetsData] = useState<UpdateSheetsData>({
    row: undefined,
    B: '',
    C: '',
    D: '',
    E: '',
    F: '',
    G: '',
    H: '',
    I: '',
    J: '',
    K: '',
    L: '',
    M: '',
    N: '',
  });
  // 
  const dataList = useMemo(() => {
    const arr = [...sheetData.slice(1)];
    return arr.filter((row) => row[1].includes(searchData.name)); // Filter rows based on searchData.name
  }, [JSON.stringify(searchData), sheetData.toString()])

  // Function to get the cell range in format like A1, B1, ..., Z1, AA1, AB1, etc.
  const getCellRange = (rowIndex: number, colIndex: number): string => {
    const column = getColumnLetter(colIndex); // Get the column letter for the current index
    return `${column}${rowIndex + 1}`; // Return the cell in format like A1, B1, C1, ..., AA1, AB1, etc.
  };

  // Helper function to convert column index to letter (supports multi-letter columns)
  const getColumnLetter = (colIndex: number): string => {
    let columnName = "";
    while (colIndex >= 0) {
      columnName = String.fromCharCode((colIndex % 26) + 65) + columnName; // Convert number to letter
      colIndex = Math.floor(colIndex / 26) - 1; // Move to the next digit in base-26
    }
    return columnName;
  };

  const initClient = () => {
    gapi.client
      .init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4",
        ],
        scope: "https://www.googleapis.com/auth/spreadsheets",
      })
      .then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());

        authInstance.isSignedIn.listen(setIsSignedIn);
        setAuthLoaded(true);
      })
      .catch((error: any) => {
        console.error("Error initializing Google API client:", error);
      });
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const onUpdateSheet = () => {
    const no = updateSheetsData.row // แถวที่ต้องการอัพเดท
    const allData = { A: Number(no || '1') - 1, ...updateSheetsData };
    delete allData.row; // remove row key

    const n = Object.keys(allData).map((key) => ({
      range: `Sheets1!${key}${no}`,
      values: [[allData[key as keyof UpdateSheetsData]]],
    }))

    console.log("allData:", n);
    if (isSignedIn) {


      const params = {
        spreadsheetId: process.env.REACT_APP_SHEETS_ID,
        resource: {
          data: n,
          valueInputOption: "USER_ENTERED",
        },
      };

      const request =
        gapi.client.sheets.spreadsheets.values.batchUpdate(params);
      request.then(
        (response: any) => {
          getSheets();

          alert("Sheet updated successfully");
        },
        (error: any) => {
          console.error("Error updating the sheet", error);
          alert("Error updating the sheet");
        }
      );
    }
  };

  const onChangeData = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setUpdateSheetsData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getSheets = async () => {
    // API URL and your API key
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SHEETS_ID}/values/Sheets1?key=${process.env.REACT_APP_API_KEY}`;

    // Fetch data from Google Sheets
    axios
      .get<SheetData>(apiUrl)
      .then((response) => {
        const data = response.data.values;
        console.log("data:", data);
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
    gapi.load("client:auth2", initClient);
    getSheets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Zoo Insect Hub</h1>
      <div className="form-update">
        <div className="form-group">
          {!authLoaded ? (
            <div>Loading...</div>
          ) : isSignedIn ? (
            <div>
              <div className="form-group d-flex">
                <p className="mt-auto mb-0 me-3">You are signed in!</p>
                <button
                  className="btn btn-danger btn-sm d-inline-block"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>

              <FormUpdateSheet
                count={dataList.length}
                data={updateSheetsData}
                setData={(e) => setUpdateSheetsData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                onUpdate={onUpdateSheet}
              />
            </div>
          ) : (
            <div>
              <button className="btn btn-primary" onClick={handleSignIn}>
                Sign In to Google
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <FormUpdateSheet
        count={dataList.length}
        data={updateSheetsData}
        setData={(e) => setUpdateSheetsData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
        onUpdate={onUpdateSheet}
      /> */}

      <hr />
      <h2>Search</h2>
      <div style={{ display: "flex" }}>
        <div className="form-group">
          <label className="form-label">insect name</label>
          <input
            className="form-control"
            name="name"
            value={searchData.name}
            onChange={(e) => setSearchData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

      </div>
      <div className="table-listing-container">
        <div className="table-listing-content">
          {!loading && (
            <table className="table table-hover">
              <thead>
                <tr>
                  {sheetData[0].length > 0 &&
                    sheetData[0]?.map((col, index) => {
                      if (!col) return null;
                      return (
                        <th style={{ whiteSpace: "nowrap" }} key={index}>
                          {col} {getColumnLetter(index)}
                        </th>
                      )
                    })}
                </tr>
              </thead>
              <tbody>
                {dataList.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => {
                      if (cellIdx === 3 && cell) {
                        return <td key={cellIdx}>
                          <div dangerouslySetInnerHTML={{ __html: cell as string }} />
                        </td>
                      }
                      if (cellIdx === 12 && cell) {
                        return <td key={cellIdx}>
                          <embed style={{ width: '100px', height: '50px' }} src={cell} alt="" />
                        </td>
                      }
                      return (
                        <td key={cellIdx}>
                          {cell}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default GoogleSheetData
