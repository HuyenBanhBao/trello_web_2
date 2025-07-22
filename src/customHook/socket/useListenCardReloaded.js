import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentActiveCard, selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";
import { socketIoInstance } from "~/socketClient"; // real-time

const useListenCardReloaded = () => {
    const dispatch = useDispatch();
    const activeCard = useSelector(selectCurrentActiveCard);

    useEffect(() => {
        const handleCardReloaded = ({ cardId, updatedCard }) => {
            if (activeCard?._id === cardId) {
                dispatch(updateCurrentActiveCard(updatedCard));
                dispatch(updateCardInBoard(updatedCard));
            }
        };

        socketIoInstance.on("BE_CARD_RELOADED", handleCardReloaded);

        return () => {
            socketIoInstance.off("BE_CARD_RELOADED", handleCardReloaded);
        };
    }, [activeCard, dispatch]);
};

export default useListenCardReloaded;
