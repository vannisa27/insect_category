import { Select, Input, Button, Form, FormInstance } from "antd";
import { useGoogleApi } from "../GoogleLoginApiProvider";

const { Option } = Select;

type UpdateSheetsData = {
  row?: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
  I: string;
  J: string;
  K: string;
  L: string;
  M: string;
  N: string;
};

type FormUpdateSheetProps = {
  count: number;
};

function FormUpdateSheet({
  count,
}: // form,
// data,
// setData,
// onUpdate = () => {},
FormUpdateSheetProps) {
  const { auth2, isSignedIn } = useGoogleApi();
  const [form] = Form.useForm<UpdateSheetsData>();

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

  const onUpdateSheet = async (values: UpdateSheetsData) => {
    const no = values.row; // แถวที่ต้องการอัพเดท
    const allData = { A: Number(no || "1") - 1, ...values };
    delete allData.row; // remove row key

    const n = Object.keys(allData).map((key) => ({
      range: `Sheets1!${key}${no}`,
      majorDimension: "ROWS",
      values: [[allData[key as keyof UpdateSheetsData]]],
    }));

    if (isSignedIn && auth2) {
      const user = auth2.currentUser.get();
      const token = user.getAuthResponse().access_token;
      const spreadsheetId = process.env.REACT_APP_SHEETS_ID;
      const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;
      const requestBody = {
        valueInputOption: "USER_ENTERED", // or "RAW"
        data: n,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("result:", result);
    }
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      style={{ maxWidth: 600 }}
      labelCol={{
        xs: { span: 24 },
        sm: { span: 6 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        sm: { span: 14 },
      }}
      onFinish={onUpdateSheet}
    >
      <Form.Item label="ลำดับที่" name="row" rules={[{ required: true }]}>
        <Select>
          {Array.from({ length: count + 2 }).map((_, index) => (
            <Option key={index} value={String(index + 2)}>
              {index + 1} ({getCellRange(index + 1, 0)})
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="ชื่อแมลง" name="B" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="ชื่อวิทยาศาสตร์" name="D">
        <Input />
      </Form.Item>

      <Form.Item label="วงศ์" name="E">
        <Input />
      </Form.Item>

      <Form.Item label="ประเภท" name="F">
        <Input />
      </Form.Item>

      <Form.Item label="สถานภาพ" name="G">
        <Input />
      </Form.Item>

      <Form.Item label="วันที่พบ" name="H">
        <Input />
      </Form.Item>

      <Form.Item label="สถานที่พบ" name="I">
        <Input />
      </Form.Item>

      <Form.Item label="พฤติกรรม" name="J">
        <Input />
      </Form.Item>

      <Form.Item label="ผู้พบ" name="K">
        <Input />
      </Form.Item>

      <Form.Item label="บันทึกเพิ่มเติม" name="L">
        <Input />
      </Form.Item>

      <Form.Item label="ลิ้งค์รูปภาพ" name="M">
        <Input />
      </Form.Item>

      <Form.Item label="หมายเหตุ" name="N">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginTop: "auto" }}>
          Update
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FormUpdateSheet;
