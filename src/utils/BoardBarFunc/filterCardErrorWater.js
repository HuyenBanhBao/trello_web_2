export const filterCardErrorWater = (board) => {
    const filteredColumns = board.columns
        .map((column) => {
            const filteredCards = column.cards.filter((card) => {
                if (!card.reportCard || !Array.isArray(card.reportCard)) return false;

                // Kiểm tra trong mỗi reportCard, có reportContent chứa key "electric"
                return card.reportCard.some((report) => {
                    const keys = report?.reportContent ? Object.keys(report.reportContent) : [];
                    return keys.includes("water");
                });
            });

            if (filteredCards.length === 0) return null;

            return {
                ...column,
                cards: filteredCards,
                cardOrderIds: filteredCards.map((card) => card._id),
            };
        })
        .filter(Boolean);

    return {
        ...board,
        columns: filteredColumns,
        columnOrderIds: board.columnOrderIds.filter((id) => filteredColumns.some((col) => col._id === id)),
    };
};
