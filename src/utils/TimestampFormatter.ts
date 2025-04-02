export const formatTimestamp = (timestampInput?: string | number): string => {
    if (timestampInput === undefined || timestampInput === null) return "";

    let timestamp: string;
    // If the timestamp is a number, convert it to an ISO string.
    if (typeof timestampInput === "number") {
        timestamp = new Date(timestampInput).toISOString();
    } else {
        timestamp = timestampInput;
    }

    try {
        let normalized: string;
        if (timestamp.endsWith("Z")) {
            normalized = timestamp;
        } else {
            normalized = timestamp.replace(/:(?=\d\d$)/, "");
        }

        const date = new Date(normalized);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Ho_Chi_Minh",
        });
    } catch (err) {
        console.error("Error formatting timestamp:", err);
        return "";
    }
};