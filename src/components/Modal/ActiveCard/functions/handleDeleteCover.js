import { toast } from "react-toastify";

// =======================================================================
export const handleDeleteCover = async ({ confirmDeleteCol, callAPIUpdateCard }) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmed, reason } = await confirmDeleteCol({
        title: "Delete column?",
        description: "Are you sure you want to delete this column and it's Cards?",
        confirmationText: "Confirm",
        cancellationText: "Cancel",
        buttonOrder: ["confirm", "cancel"],
        confirmationButtonProps: {
            variant: "contained",
            sx: {
                color: (theme) => theme.trello.colorDustyCloud,
                backgroundColor: (theme) => theme.trello.colorSlateBlue,

                boxShadow: (theme) => theme.trello.boxShadowBtn,
                transition: "all 0.25s ease-in-out",

                "&:hover": {
                    borderColor: "white",
                    boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                    backgroundColor: (theme) => theme.trello.colorSlateBlue,
                },
            },
        },
    });
    if (confirmed) {
        let reqData = new FormData();
        reqData.append("cardCover", "");
        // Gọi API...
        toast.promise(callAPIUpdateCard(reqData), {
            pending: "Deleting...",
        });
    }
};
