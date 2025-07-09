// let apiRoot = "";
// console.log("import.meta.env: ", import.meta.env);

// if (import.meta.env.DEV) {
//     apiRoot = "http://localhost:4000";
//     console.log("apiRoot: ", apiRoot);
// } else if (!import.meta.env.PROD) {
//     apiRoot = "https://trello-api-jt1q.onrender.com";
//     console.log("apiRoot: ", apiRoot);
// }
// // export const API_ROOT = "http://localhost:4000";
// export const API_ROOT = apiRoot;
let apiRoot = "";

if (import.meta.env.DEV) {
    apiRoot = "http://localhost:4000";
} else {
    apiRoot = "https://trello-api-jt1q.onrender.com";
}
export const API_ROOT = apiRoot;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 12;

export const CARD_MEMBER_ACTIONS = {
    ADD: "ADD",
    REMOVE: "REMOVE",
};
