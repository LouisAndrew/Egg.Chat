const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const getTime = (date: Date) => {
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    const dateAndMonth = (dt: Date) =>
        `${pad(date.getDate())} ${months[date.getMonth()]}`;
    const now = new Date();

    if (date.getMonth() !== now.getMonth()) {
        return dateAndMonth(date);
    }

    if (date.getDate() !== now.getDate()) {
        // create date object of yesterday timestamp.
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);

        if (yesterdayDate === date) {
            return 'Yesterday';
        } else {
            return dateAndMonth(date);
        }
    }

    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export { getTime };
