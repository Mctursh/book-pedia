const truncateDesc = (str) => {
    if (str.length > 40) {
        return  `${str.substring(0, 40)}...`
    } else {
        return str
    }
}

const truncateName = (str) => {
    if (str.length > 25) {
        return  `${str.substring(0, 18)}...`
    } else {
        return str
    }
}

const paginate = (options) => {
    let attribs;

    attribs = JSON.parse(options.hash.dataAttribs);
    return attribs.text
} 
// const paginate = (nums, currPage) => {
//     const status = nums == currPage ? "active" : ""
//     const format = (num) => {
//         return `<li class="pa-item ${status}"><a href="/page/${num}">${num}</a></li>\n`
//     }
//     let suggestionList = '';
//     for (let index = 1; index <= nums; index++) {
//         suggestionList += format(index)
//     }
//     return suggestionList
// } 

module.exports = { truncateDesc, truncateName, paginate }