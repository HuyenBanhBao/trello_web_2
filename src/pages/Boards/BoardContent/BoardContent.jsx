/* eslint-disable no-unused-vars */
// ---------------------- IMPORT LIB ----------------------
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { cloneDeep, isEmpty } from "lodash";
import Grid from "@mui/material/Unstable_Grid2";
// --------------------- IMPORT COMPONENTS ---------------------
import BoardSlideBar from "./BoardSlidebar/BoardSlideBar";
import BoardColumns from "./BoardColumns/BoardColumns";
import BoardColumn from "./BoardColumns/BoardColumn/BoardColumn";
import CardMain from "./BoardColumns/BoardColumn/ListCards/CardItem/CardMain";
// -------------------- IMPORT UTILS ---------------------
import { generatePlaceholder } from "~/utils/formatters";
// --------------------- DND KIT ---------------------
import {
    DndContext,
    useSensors,
    useSensor,
    MouseSensor,
    TouchSensor,
    DragOverlay,
    defaultDropAnimationSideEffects,
    closestCorners,
} from "@dnd-kit/core";
// import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { arrayMove } from "@dnd-kit/sortable";
// ----------------------------------------------------------
const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
    CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};
// ------------------------------------------ MAIN COMPONENT ------------------------------------------
const BoardContent = ({ board, moveColumns, moveCardInTheSameColumn, moveCardToDifferentColumns }) => {
    // =========================================== STATE ===========================================
    const [orderedColumns, setOrderedColumns] = useState([]);
    const [activeDragItemId, setActiveDragItemId] = useState(null); // Cùng một lúc chỉ có 1 column hoặc card được kéo thả
    const [activeDragItemType, setActiveDragItemType] = useState(null);
    const [activeDragItemData, setActiveDragItemData] = useState(null);
    const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null);

    useEffect(() => {
        // Columns đã được sắp xếp ở column cha (video 71)
        setOrderedColumns(board.columns); // SẮP XẾP CÁC COLUMN TRONG "columns" THEO MẢNG "ColumnsIds" và trả về mảng mới
    }, [board]);

    // =========================================== XỬ LÝ KÉO THẢ BẰNG CHUỘT HOẶC BẰNG TAY ===========================================
    // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 3 } }); // Yêu cầu chuột di chuyển ít nhất 10px thì mới gọi event. Tránh trường hợp gọi hàm khi click chuột vào column
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 500 } }); // Nhấn giữ 250ms và dung sai của cảm ừng thì mới kích hoạt event
    const mySensors = useSensors(mouseSensor, touchSensor); // const mySensors = useSensors(pointerSensor);

    // =========================================== FUNCTION ===========================================
    const findColumnByCardId = (cardId) => {
        // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chình trước rồi mới tạo ra cardOrderIds mới
        return orderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId));
    };

    // ====================================== DRAG START - OVER - END ======================================
    // -------------------- DRAG START --------------------
    const handleDragStart = (event) => {
        // console.log(event);

        setActiveDragItemId(event?.active?.id); // tra về id của card hoặc column đang kéo
        setActiveDragItemType(
            event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN // Trả về kiểu của phần tử đang kéo (CARD hoặc COLUMN)
        );
        setActiveDragItemData(event?.active?.data?.current); // Trả về data của card hoặc column đang kéo

        if (event?.active?.data?.current?.columnId) {
            setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id)); // Trả về column của card đang kéo. Lưu ý: chỉ xử lý khi kéo card. Sau đó set cho "oldColumnWhenDraggingCard"
        }
    };
    // -------------------- DRAG OVER --------------------

    const handleDragOver = (event) => {
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return; // Không xử lý khi kéo column

        const { active, over } = event;
        if (!active || !over) return; // check: if active and over are null -> return

        const {
            id: activeDraggingCardId, // Là card đang kéo
            data: { current: activeDraggingCardData }, // Là data của card đang kéo
        } = active;
        const { id: overCardId } = over; // overCard là card dang tương tác trên hoặc dưới so với card đang kéo

        // Tìm hai column theo cardId
        const activeColumn = findColumnByCardId(activeDraggingCardId);
        const overColumn = findColumnByCardId(overCardId);

        if (!activeColumn || !overColumn) return; // check: if activeColumn or overColumn are null -> return

        // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
        // Vì đây là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
        if (activeColumn._id !== overColumn._id) {
            // Thêm điều kiện kiểm tra để tránh update không cần thiết
            if (activeDraggingCardId === overCardId) return;

            setOrderedColumns((prevColumns) => {
                // index of the card to be moved (Vị trí của phần tử cần di chuyển)
                const overCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId);
                let newCardIndex;
                const isBelowOverItem =
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

                const nextColumns = cloneDeep(prevColumns);
                const nextActiveColumn = nextColumns.find((c) => c._id === activeColumn._id);
                const nextOverColumn = nextColumns.find((c) => c._id === overColumn._id);

                // column 1: remove the card from the column
                if (nextActiveColumn) {
                    nextActiveColumn.cards = nextActiveColumn?.cards?.filter((c) => c._id !== activeDraggingCardId); // remove the card from the column

                    if (isEmpty(nextActiveColumn.cards)) {
                        nextActiveColumn.cards = [generatePlaceholder(nextActiveColumn)];
                    }
                    nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map((c) => c._id); // update the cardOrderIds
                }

                // column 2: insert the card into the column
                if (nextOverColumn) {
                    nextOverColumn.cards = nextOverColumn?.cards?.filter((c) => c._id !== activeDraggingCardId); // remove the card from the column

                    // rebuild_activeDraggingCardData: rebuild data of card when drag it to another column
                    const rebuild_activeDraggingCardData = {
                        ...activeDraggingCardData,
                        columnId: nextOverColumn._id,
                    };

                    nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(
                        newCardIndex,
                        0,
                        rebuild_activeDraggingCardData
                    ); // insert the card into the column

                    nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard);
                    nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map((c) => c._id); // update the cardOrderIds
                }

                return nextColumns;
            });
        }
    };
    // -------------------- DRAG END --------------------

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!active || !over) return; // check: if active and over are null -> return
        // ----------------- Xử lý kéo thả COLUMN -----------------
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            if (active.id !== over.id) {
                // check: if active and over are not equal -> return
                const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id); // index of the column to be moved (Vị trí của phần tử cần di chuyển)
                const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id); // index of the column to be moved to (Vị trí đích nơi phần tử sẽ được chuyển đến)
                const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex);
                // Vẫn gọi update state ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API (small trick)
                setOrderedColumns(dndOrderedColumns);
                /**
                 * Gọi lên props function moveColumns nằm ở component cha cao nhất (boards/_id.jsx)
                 * Lưu ý: sau đó học phần MERN Stack Advance nâng cao học trừu tượng mình sẽ với dữ liệu Board ra ngoài Redux Global Store,
                 * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
                 * - Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
                 */
                moveColumns(dndOrderedColumns);
            }
        }
        // ----------------- Xử lý kéo thả CARD -----------------
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            const {
                id: activeDraggingCardId, // Là card đang kéo
                data: { current: activeDraggingCardData },
            } = active;
            const { id: overCardId } = over; // overCard là card dang tương tác trên hoặc dưới so với card đang kéo
            // Tìm hai column theo cardId
            const activeColumn = findColumnByCardId(activeDraggingCardId);
            const overColumn = findColumnByCardId(overCardId);
            if (!activeColumn || !overColumn) return; // check: if activeColumn or overColumn are null -> return
            // Hành động kéo thẻ card giữa 2 column khác nhau
            // Phải dùng tới oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart), k phải activeData trong scope handleDragEnd này vì sau khi di qua onDragOver tới đây là state của card đã bị cập nhật một lần rồi.
            if (oldColumnWhenDraggingCard._id !== overColumn._id) {
                // check: if activeColumn and overColumn are not equal
                setOrderedColumns((prevColumns) => {
                    // index of the card to be moved (Vị trí của phần tử cần di chuyển)
                    const overCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId);
                    let newCardIndex;
                    const isBelowOverItem =
                        active.rect.current.translated &&
                        active.rect.current.translated.top > over.rect.top + over.rect.height;
                    const modifier = isBelowOverItem ? 1 : 0;
                    newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;
                    const nextColumns = cloneDeep(prevColumns);
                    const nextActiveColumn = nextColumns.find((c) => c._id === activeColumn._id);
                    const nextOverColumn = nextColumns.find((c) => c._id === overColumn._id);
                    // column 1: remove the card from the column
                    if (nextActiveColumn) {
                        nextActiveColumn.cards = nextActiveColumn?.cards?.filter((c) => c._id !== activeDraggingCardId); // remove the card from the column
                        if (isEmpty(nextActiveColumn.cards)) {
                            nextActiveColumn.cards = [generatePlaceholder(nextActiveColumn)];
                        }
                        nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map((c) => c._id); // update the cardOrderIds
                    }
                    // column 2: insert the card into the column
                    if (nextOverColumn) {
                        nextOverColumn.cards = nextOverColumn?.cards?.filter((c) => c._id !== activeDraggingCardId); // remove the card from the column
                        // rebuild_activeDraggingCardData: rebuild data of card when drag it to another column
                        const rebuild_activeDraggingCardData = {
                            ...activeDraggingCardData,
                            columnId: nextOverColumn._id,
                        };
                        nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(
                            newCardIndex,
                            0,
                            rebuild_activeDraggingCardData
                        ); // insert the card into the column
                        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard);
                        nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map((c) => c._id); // update the cardOrderIds
                    }
                    moveCardToDifferentColumns(
                        activeDraggingCardId,
                        oldColumnWhenDraggingCard._id,
                        nextOverColumn._id,
                        nextColumns
                    );
                    return nextColumns;
                });
            } else {
                // check: if activeColumn and overColumn are equal
                const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((c) => c._id === activeDragItemId); // index of the column to be moved (Vị trí của phần tử cần di chuyển)
                const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId); // index of the column to be moved to (Vị trí đích nơi phần tử sẽ được chuyển đến)
                const dndOrderedCard = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex);
                const dndOrderedCardIds = dndOrderedCard.map((c) => c._id); // update the cardOrderIds
                setOrderedColumns((prevColumns) => {
                    const nextColumns = cloneDeep(prevColumns);
                    // const nextActiveColumn = nextColumns.find((c) => c._id === activeColumn._id);
                    const targetColumn = nextColumns.find((c) => c._id === overColumn._id); // column to be moved to
                    targetColumn.cards = dndOrderedCard;
                    targetColumn.cardOrderIds = dndOrderedCardIds; // update the cardOrderIds;
                    return nextColumns; // return the nextColumns
                });
                moveCardInTheSameColumn(dndOrderedCard, dndOrderedCardIds, oldColumnWhenDraggingCard._id);
            }
        }
        setActiveDragItemId(null);
        setActiveDragItemType(null);
        setActiveDragItemData(null);
        setOldColumnWhenDraggingCard(null);
        // ----------------- Xử lý kéo thả CARD -----------------
    };
    // ===================================================================================================================================
    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };

    // ========================================== RETURN ==========================================
    return (
        <>
            <DndContext
                sensors={mySensors}
                collisionDetection={closestCorners} // Thuật toán phát hiện va chạm giữa các phần tử
                // collisionDetection={collisionDetectionStrategy} // Thuật toán phát hiện va chạm giữa các phần tử (sửa bug nhấp nháy khi keo tha)
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        height: (theme) => theme.trello.boardContentHeight,
                        background: (theme) => theme.trello.colorGunmetalBlue,
                    }}
                >
                    <Grid container sx={{ width: "100%" }}>
                        <Grid
                            sx={{
                                display: { xs: "none", md: "flex" },
                                flexDirection: "column",
                                width: "350px",
                                p: "10px 0",
                                height: (theme) => theme.trello.boardContentHeight,
                            }}
                        >
                            <BoardSlideBar />
                        </Grid>
                        {/* --------------------- BOX COLUMNS ---------------------- */}
                        {/* <BoardColumns columns={board?.columns} /> */}
                        <Grid
                            sx={{
                                width: "100%",
                                flex: 1,
                                p: { xs: "6px 0", md: "10px 0" },
                                pl: { xs: 0.5, md: 0 },
                                mr: { xs: 0.5, md: 0 },
                                height: (theme) => theme.trello.boardContentHeight,
                            }}
                        >
                            <Box sx={{ height: "100%", width: "100%" }}>
                                <BoardColumns columns={orderedColumns} />
                                <DragOverlay dropAnimation={dropAnimation}>
                                    {!activeDragItemType && null}
                                    {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
                                        <BoardColumn column={activeDragItemData} />
                                    )}
                                    {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
                                        <CardMain card={activeDragItemData} />
                                    )}
                                </DragOverlay>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DndContext>
        </>
    );
};
export default BoardContent;
