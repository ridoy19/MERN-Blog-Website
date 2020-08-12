export const formatDate = (date) => {
    const options = {year: 'numeric', month: 'long', day: 'numeric' };
    const dat = new Date(date)
    return dat.toLocaleDateString('en-US', options)
}