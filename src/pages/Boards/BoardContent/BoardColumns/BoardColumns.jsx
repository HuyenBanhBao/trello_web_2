import { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BoardColumn from "./BoardColumn/BoardColumn";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { useTheme } from "@mui/material/styles";
import { createNewColumnAPI } from "~/apis";
import { generatePlaceholder } from "~/utils/formatters";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
    updateCurrentActiveBoard,
    setOriginalBoard,
    selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
// --------------------- DND KIT ---------------------
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
// ---------------------------------- MAIN COMPONENT ---------------------
const BoardColumns = ({ columns }) => {
    const themeTrello = useTheme();
    // ===================================== STATE & FUNCTIONS =====================================
    // ===================================== OPEN - CLOSE FORM ADD NEW COLUMN =====================================
    const dispatch = useDispatch(); // Khai báo dispatch
    const board = useSelector(selectCurrentActiveBoard); // Khai báo board

    const [openFormAddColumn, setOpenFormAddColumn] = useState(false);
    const toggleFormAddColumn = () => {
        setOpenFormAddColumn(!openFormAddColumn);
    };

    // ===================================== FORM ADD NEW COLUMN =====================================
    const [newNameColumn, setNewNameColumn] = useState("");
    const addNewColumn = async () => {
        // setOpenFormAddColumn(false);
        if (!newNameColumn) {
            toast.error("Please enter column name");
            return;
        }

        // Tạo dữ liệu Column để gọi API
        const newColumnData = {
            title: newNameColumn,
        };

        // ============================ gọi API tạo mới 1 column và làm lại dữ liệu State Board ============================
        const createdColumn = await createNewColumnAPI({
            ...newColumnData,
            boardId: board._id, // Thêm boardId vào dữ liệu cột mới
        });
        createdColumn.cards = [generatePlaceholder(createdColumn)];
        createdColumn.cardOrderIds = [generatePlaceholder(createdColumn)._id];
        // Gọi API thành công thì sẽ làm lại dữ liệu State Board
        // Phía FE chúng ta phải tự làm đúng lại state board để render lại dữ liệu (thay vì phải gọi lại API fetchBoardDetailAPI)
        // CÁCH 1: +++++++++++++++++++
        /** Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spread operator là Shallow Copy/Clone, nên dính phải rules Immutable trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản nhanh gọn nhất ở trường hợp này của chúng ta là dùng Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn.
         *
         *
         * */
        const newBoard = cloneDeep(board);
        newBoard.columns.push(createdColumn); // Thêm cột mới vào mảng columns
        newBoard.columnOrderIds.push(createdColumn._id); // Thêm id của cột mới vào mảng columnOrder
        // CÁCH 2: +++++++++++++++++++
        /**
         * Ngoài ra cách nữa là vẫn có thể dùng array.concat thay cho push như docs của Redux Toolkit ở trên vì push đã nói nó sẽ thay đổi giá trị trực tiếp, còn tránh concat thì nó merge – ghép mảng lại và tạo ra một mảng mới để chúng ta gán lại giá trị nên không vấn đề gì
         */
        // const newBoard = { ...board };
        // newBoard.columns = newBoard.columns.concat([createdColumn]);
        // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id]); // Thêm id của cột mới vào mảng columnOrder
        // CÁCH 3: +++++++++++++++++++
        /**
         * Cách 3 là dùng Immer, Redux Toolkit đã hỗ trợ sẵn Immer nên ta có thể dùng luôn mà không cần import Immer
         */
        // const newBoard = produce(board, (draft) => {
        //     draft.columns.push(createdColumn);
        //     draft.columnOrderIds.push(createdColumn._id);
        // });
        // Gán giá trị newBoard vào thì chính là "action" trong redux
        dispatch(updateCurrentActiveBoard(newBoard)); // Cập nhật lại board trong redux
        dispatch(setOriginalBoard(newBoard));
        // ============================ ket thuc gọi API tạo mới 1 column và làm lại dữ liệu State Board ============================
        // Reset form
        toggleFormAddColumn();
        setNewNameColumn(""); // Reset giá trị input sau khi thêm column thành c
    };
    // ====================================================================================================================================================
    return (
        <>
            <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
                <Box
                    sx={{
                        background: (theme) => theme.trello.colorDustyCloud,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        overflowX: "auto",
                        overflowY: "hidden",
                        borderRadius: "8px",
                        p: 2,
                        pl: 0,
                        boxShadow: (theme) => theme.trello.boxShadowBulletin,
                        "&::-webkit-scrollbar-track": { m: 2 },
                    }}
                >
                    {columns?.map((column) => (
                        <BoardColumn key={column._id} column={column} />
                    ))}

                    {/* -------------------- ADD NEW COLUMN -------------------- */}
                    {!openFormAddColumn ? (
                        <Box
                            onClick={toggleFormAddColumn}
                            sx={{
                                minWidth: "250px",
                                maxWidth: "250px",
                                ml: 2,
                                height: "fit-content",
                                borderRadius: "6px",
                            }}
                        >
                            <Button
                                startIcon={<LibraryAddIcon />}
                                sx={{
                                    p: 1,
                                    pl: 2,
                                    width: "100%",
                                    justifyContent: "flex-start",
                                    bgcolor: (theme) => theme.trello.colorPaleSky,
                                    color: (theme) => theme.trello.colorFogWhiteBlue,
                                    border: (theme) => `1px solid ${theme.trello.colorFrostGray}`,
                                    boxShadow: (theme) => theme.trello.boxShadowPrimary,
                                    transition: "all ease 0.3s",
                                    "&:hover": {
                                        bgcolor: (theme) => theme.trello.colorIronBlue,
                                    },
                                }}
                            >
                                Add new column
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                minWidth: "250px",
                                maxWidth: "250px",
                                mx: 2,
                                p: 1,
                                height: "fit-content",
                                borderRadius: "6px",
                                bgcolor: (theme) => theme.trello.colorSnowGray,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                border: (theme) => `1px solid ${theme.trello.colorFrostGray}`,
                                boxShadow: (theme) => theme.trello.boxShadowPrimary,
                            }}
                        >
                            <TextField
                                label="Enter column title"
                                type="text"
                                size="small"
                                variant="outlined"
                                autoFocus
                                value={newNameColumn}
                                onChange={(e) => setNewNameColumn(e.target.value)}
                                sx={{
                                    "& label": {
                                        color: (theme) => theme.trello.colorSlateBlue,
                                    },
                                    "& input": {
                                        color: (theme) => theme.trello.colorSlateBlue,
                                    },
                                    "& label.Mui-focused": {
                                        color: (theme) => theme.trello.colorSlateBlue,
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: (theme) => theme.trello.colorSlateBlue,
                                        },
                                        "&:hover fieldset": {
                                            borderColor: (theme) => theme.trello.colorSlateBlue,
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: (theme) => theme.trello.colorSlateBlue,
                                        },
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Button
                                    className="interceptor-loading"
                                    onClick={addNewColumn}
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={themeTrello.trello.btnPrimary}
                                >
                                    Add columns
                                </Button>
                                <Button
                                    onClick={toggleFormAddColumn}
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    sx={themeTrello.trello.btnPrimaryCancel}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </SortableContext>
        </>
    );
};

export default BoardColumns;
