const getTime = (date: Date) => {
    const pad = (num: number) => (num < 10 ? `0${num}` : num);

    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export { getTime };
