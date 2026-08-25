/**
 * Nullable Union - Test null as active case
 * Demonstrates that null values in union properties round-trip correctly
 */
export function processNullable(unionData) {
    console.log("JS received nullable union:", unionData);
    
    if (unionData.message !== undefined) {
        return {
            type: "WithValue",
            message: unionData.message,
            value: unionData.value,
            display: `WithValue: "${unionData.message}", value = ${unionData.value ?? "null"}`,
            note: `Value is ${unionData.value === null ? "NULL (important!)" : unionData.value}`
        };
    } else {
        return {
            type: "EmptyCase",
            display: "Empty case received"
        };
    }
}
export async function callCSharpWithNullableUnion() {
    console.log("JS calling C# method with NullableUnion (value = 42)");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleNullableFromJS", { message: "from JS", value: 42 });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithNullValue() {
    console.log("JS calling C# method with NullableUnion (value = null)");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleNullableFromJS", { message: "from JS", value: null });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}
