//takes a number and forms an array of numbers from 0 to the number arg
const genArr = (num, curr) => {
    let arr = []
    for (let index = 1; index <= num; index++) {
        const status = index == curr
        arr.push({page: index, status})    
    }
    return arr
}

module.exports = genArr