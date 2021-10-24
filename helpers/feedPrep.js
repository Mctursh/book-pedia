const chunkArr = require("./chunkArr")
const genArr = require("./generateArr")

const feedPrep = (arr, pageNum) => {
    const chunks = chunkArr(arr, 10)
    const next = pageNum == chunks.length ? false : pageNum + 1
    const prev = pageNum - 1 <= 0 ? false : pageNum - 1
    const totalPages = genArr(chunks.length, pageNum)
    const matchArr = chunks[pageNum - 1]

    return { next, prev, totalPages, matchArr }
}

module.exports = feedPrep