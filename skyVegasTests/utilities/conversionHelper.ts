export const currencyStringToNumber = (
    currencyString: string | null | undefined
): number => {
    if (!currencyString) {
        return 0;
    }
    // Remove any non-digit characters except for the decimal point
    const cleanedString = currencyString.replace(/[^\d.-]/g, '');
    // Convert the cleaned string to a number
    const numberValue = parseFloat(cleanedString);
    return Number(numberValue.toFixed(2));
};

export const numberToTwoDecimalPlaces = (x: number): number =>
    Number(x.toFixed(2));
