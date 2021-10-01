const convertSize = (num) => {
    if (num > 1000000) { //greater than 1MB
       return  `${(num / 1000000).toFixed(1)} MB`
    } else { // less than 1MB, hence KB 
       return `${(num / 1000).toFixed(1)} Kb`
    }
}

module.exports = convertSize