export const parseDate = (date) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dateObject = new Date(date)
    const year = dateObject.getFullYear()
    const month = months[dateObject.getMonth()]
    const num = date?.substring(8,10)
    const day = days[dateObject.getDay()]
    return `${day}, ${month} ${num && num}, ${year}`.toUpperCase()
 }

 export const getImagePath = (imageHash) => {
    const imagePath = `https://photos.smugmug.com/photos/i-${imageHash}/0/X5/i-${imageHash}-X5.jpg`
    return imagePath
 }