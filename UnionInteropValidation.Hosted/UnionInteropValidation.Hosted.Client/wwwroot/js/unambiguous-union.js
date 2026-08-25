/**
 * Unambiguous Union - Test int vs string unions
 * Demonstrates that different JSON types (number vs string) are self-discriminating
 */

export function processUnambiguous(unionData) {
    console.log("JS received unambiguous union:", unionData);
    
    return {
        type: typeof unionData.value === "number" ? "int" : "string",
        receivedValue: unionData.value,
        display: `Received ${typeof unionData.value === "number" ? "number" : "string"}: ${unionData.value}`
    };
}

export async function receiveInt() {
    console.log("JS calling C# method with UnambiguousInt");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidationWasm.Client", "HandleUnambiguousFromJS", { value: 99 });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

export async function receiveString() {
    console.log("JS calling C# method with UnambiguousString");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidationWasm.Client", "HandleUnambiguousFromJS", { value: "from javascript" });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}
