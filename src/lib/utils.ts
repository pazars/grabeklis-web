export function formatLatvianDate(date: Date, locale: string = 'lv-LV'): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    // Normalize dates to start of day for accurate comparison
    const normalizeDate = (d: Date) => {
        const normalized = new Date(d);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    const normalizedDate = normalizeDate(date);
    const normalizedToday = normalizeDate(today);
    const normalizedYesterday = normalizeDate(yesterday);
    const normalizedDayBeforeYesterday = normalizeDate(dayBeforeYesterday);

    let dateText = "";

    // Compare dates
    if (normalizedDate.getTime() === normalizedYesterday.getTime()) {
        dateText += "Vakar, ";
    } else if (normalizedDate.getTime() === normalizedDayBeforeYesterday.getTime()) {
        dateText += "Aizvakar, ";
    } else if (normalizedDate.getTime() === normalizedToday.getTime()) {
        dateText += "Šodien, ";
    }

    const day = date.getDate();
    const month = date.getMonth(); // 0-indexed

    // Latvian month names in genitive case (jūlijā, janvārī, etc.)
    const latvianMonthsGenitive = [
        "janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā",
        "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī"
    ];

    dateText += `${day}. ${latvianMonthsGenitive[month]}`;
    return dateText;
}