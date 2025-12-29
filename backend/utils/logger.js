const timestamp = () => {
    return new Date().toLocaleString("fi-FI", {
        timeZone: "Europe/Helsinki",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
};

const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`[${timestamp()}]`, ...params);
    }
};

const error = (...params) => {
    console.error(`[${timestamp()}]`, ...params);
};

module.exports = { info, error };
