type FormUpdateSheetProps = {
    count: number;
    data: any;
    setData: (never: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    onUpdate: () => void
}

function FormUpdateSheet({ count, data, setData, onUpdate = () => { } }: FormUpdateSheetProps) {

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

    return (
        <div style={{ display: "flex",flexWrap: "wrap", gap: "12px" }}>
            <div className="form-group">
                <label className="form-label">ลำดับที่</label>
                <select
                    className="form-select"
                    name="row"
                    value={data.row}
                    onChange={setData}
                >
                    <option>select</option>

                    {Array.from({ length: count + 2 }).map((_, index) => (
                        <option key={index} value={String(index + 2)}>
                            {index + 1} ({getCellRange(index + 1, 0)})
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">ชื่อแมลง</label>
                <input
                    className="form-control"
                    name="B"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">ชื่อวิทยาศาสตร์</label>
                <input
                    className="form-control"
                    name="D"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">วงศ์</label>
                <input
                    className="form-control"
                    name="E"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">ประเภท</label>
                <input
                    className="form-control"
                    name="F"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">สถานภาพ</label>
                <input
                    className="form-control"
                    name="G"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">วันที่พบ</label>
                <input
                    className="form-control"
                    name="H"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">สถานที่พบ</label>
                <input
                    className="form-control"
                    name="I"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">พฤติกรรม</label>
                <input
                    className="form-control"
                    name="J"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">ผู้พบ</label>
                <input
                    className="form-control"
                    name="K"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">บันทึกเพิ่มเติม</label>
                <input
                    className="form-control"
                    name="L"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">รูปภาพ</label>
                <input
                    className="form-control"
                    name="M"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            <div className="form-group">
                <label className="form-label">หมายเหตุ</label>
                <input
                    className="form-control"
                    name="N"
                    value={data.mark}
                    onChange={setData}
                />
            </div>
            
            <div className="form-group" style={{ display: "flex" }}>
                <button
                    className="btn btn-primary"
                    style={{ marginTop: "auto" }}
                    onClick={onUpdate}
                >
                    update
                </button>
            </div>
        </div>
    )
}


export default FormUpdateSheet;