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

const getDate = () => new Date().getFullYear()

module.exports = { truncateDesc, truncateName, getDate }