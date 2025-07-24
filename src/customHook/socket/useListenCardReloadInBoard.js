import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";
import { socketIoInstance } from "~/socketClient"; // real-time

const useListenCardReloadInBoard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // eslint-disable-next-line no-unused-vars
        const handleCardReloaded = ({ cardId, updatedCard }) => {
            dispatch(updateCardInBoard(updatedCard));
        };
        socketIoInstance.on("BE_CARD_RELOADED", handleCardReloaded);
        return () => {
            socketIoInstance.off("BE_CARD_RELOADED", handleCardReloaded);
        };
    }, [dispatch]);
};

export default useListenCardReloadInBoard;
