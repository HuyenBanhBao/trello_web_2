import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

// Một Trick xử lý css khá hay trong việc làm UI UX khi cần ẩn hiện một cái input: Hiểu đơn giản là thay vì phải tạo biến State để chuyển đổi qua lại giữa thẻ Input và Text thông thường thì chúng ta sẽ CSS lại cho cái thẻ Input trông như text bình thường, chỉ khi click và focus vào nó thì style lại trở về như cái input ban đầu.
// Controlled Input trong MUI: https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
function EditableInput({ value, onChangedValue, inputFontSize = "16px", ...props }) {
    const [inputValue, setInputValue] = useState(value);
    useEffect(() => {
        setInputValue(value);
    }, [value]);
    // Blur là khi chúng ta không còn Focus vào phần tử nữa thì sẽ trigger hành động ở đây.
    const triggerBlur = () => {
        // Support Trim cái dữ liệu State inputValue cho đẹp luôn sau khi blur ra ngoài
        setInputValue(inputValue.trim());
        // Nếu giá trị không có gì thay đổi hoặc Nếu user xóa hết nội dung thì set lại giá trị gốc ban đầu theo value từ props và return luôn không làm gì thêm
        if (!inputValue || inputValue.trim() === value) {
            setInputValue(value);
            return;
        }
        // console.log("value: ", value);
        // console.log("inputValue: ", inputValue);
        // Khi giá trị có thay đổi ok thì gọi lên func ở Props cha để xử lý
        onChangedValue(inputValue);
    };

    return (
        <TextField
            id="editable-input-controlled"
            fullWidth
            variant="outlined"
            spellCheck={false} // 👈 Tắt kiểm tra chính tả
            size="small"
            autoComplete="off"
            value={inputValue}
            onChange={(event) => {
                setInputValue(event.target.value);
            }}
            onBlur={triggerBlur}
            {...props}
            // Magic here :D
            sx={{
                "& label": {},
                "& input": { fontSize: inputFontSize, fontWeight: "bold" },
                "&.card-title-modal .MuiOutlinedInput-input": {
                    color: (theme) => theme.trello.colorSlateBlue,
                },

                "& .MuiOutlinedInput-root": {
                    backgroundColor: "transparent",
                    "& fieldset": { borderColor: "transparent" },
                },
                "& .MuiOutlinedInput-root:hover": {
                    borderColor: "transparent",
                    "& fieldset": { borderColor: "transparent" },
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                    backgroundColor: "transparent",
                    "& fieldset": { borderColor: "transparent" },
                },
                "& .MuiOutlinedInput-input": {
                    px: "6px",
                    color: (theme) => theme.trello.colorSlateBlue,
                    textAlign: "center",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                },
            }}
        />
    );
}

export default EditableInput;
