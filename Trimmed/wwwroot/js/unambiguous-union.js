/**
 * Unambiguous Union — union(int, string)
 * int case arrives as a raw JSON number; string case as a raw JSON string.
 * No wrapper object: the active case value IS the entire JSON payload.
 */

export function processUnambiguous(value) {
    console.log("JS received UnambiguousUnion active case:", value, "| JSON type:", typeof value);
    return {
        receivedValue: value,
        jsonType: typeof value,
        display: typeof value === "number"
            ? `int case: ${value}`
            : `string case: "${value}"`
    };
}

export async function receiveInt() {
    console.log("JS → C#: sending int union case 99");
    try {
        const returned = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Hosted.Client", "HandleUnambiguousFromJS", 99);
        console.log("C# → JS: returned union active case:", returned, "| type:", typeof returned);
        return { sent: 99, received: returned, receivedType: typeof returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

export async function receiveString() {
    console.log("JS → C#: sending string union case");
    try {
        const returned = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Hosted.Client", "HandleUnambiguousFromJS", "from javascript");
        console.log("C# → JS: returned union active case:", returned, "| type:", typeof returned);
        return { sent: "from javascript", received: returned, receivedType: typeof returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}
