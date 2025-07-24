export const filterCardClose = (board) => {
    const filteredColumns = board.columns
        .map((column) => {
            const filteredCards = column.cards.filter((card) => !card.userRoom || card.userRoom === "0");

            if (filteredCards.length === 0) return null;

            return {
                ...column,
                cards: filteredCards,
                cardOrderIds: filteredCards.map((card) => card._id),
            };
        })
        .filter(Boolean); // Loại bỏ các column không còn card

    return {
        ...board,
        columns: filteredColumns,
        columnOrderIds: board.columnOrderIds.filter((id) => filteredColumns.some((col) => col._id === id)),
    };
};
