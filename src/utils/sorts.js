// sort algorithms
// ---
// Order an array of objects based on another array & return new Ordered Array
// The original array will not be modified.
// ---
// @param {*} originalArray
// @param {*} orderArray
// @param {*} key = Key to order
// @return new Ordered Array
//
// For Vietnamese with love :D
// Xác định các phần tử trong array gốc ban đầu (originalArray) xem nó nằm ở đâu trong array thứ 2 (orderArray) (là array mà mình dùng để sắp xếp) bằng cách tìm index (indexOf) rồi sẽ sắp xếp theo index đó bằng hàm sort của Javascript.
//

export const mapOrder = (originalArray, orderArray, key) => {
    if (!originalArray || !orderArray || !key) return [];
    return [...originalArray].sort((a, b) => orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]));
};
// a: là object trong array originalArray;
// a[key]: là giá trị của key trong object a;
// indexOf(a[key]): tìm index của giá trị a[key] trong đối tượng gọi nói (orderArray);
// orderArray.indexOf(a[key]): trả về index của giá trị a[key] trong array orderArray;

// const clonedArray = [...originalArray];
// const orderedArray = clonedArray.sort((a, b) => {
//     return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]);
// });

// return orderedArray;
