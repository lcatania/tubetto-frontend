import { differenceInHours, differenceInSeconds, formatDistance, formatDuration, intervalToDuration, parseISO } from "date-fns";

export function calculateNextExecution(nextExecution: string) {
    const now = new Date()
    const parsedNextExecution = parseISO(nextExecution)
    let duration = intervalToDuration({
        start: now, end: parsedNextExecution
    })
    const isDiffGreater24 = differenceInHours(parsedNextExecution, now) >= 24;
    if(differenceInSeconds(parsedNextExecution, now) <= 0){
        return '00:00:00'
    }
    if (!isDiffGreater24)
        return formatDuration(duration, {
            format: ["hours", "minutes", "seconds"],
            zero: true,
            delimiter: ":",
            locale: {
                formatDistance: (_token, count) => String(count).padStart(2, "0")
            }
        });
    else
        return formatDistance(now, parsedNextExecution)
}