/**
 * Value & Reference Types - Test different fundamental types
 * Demonstrates that value types (int) and reference types (string) are properly distinguished
 */

export function processValueType(result) {
    console.log("JS received value type result:", result);
    
    if (result.value !== undefined && typeof result.value === "number") {
        return {
            type: "IntSuccess",
            value: result.value,
            jsonType: typeof result.value,
            display: `Int Success: ${result.value}`,
            note: "Value is a JSON number (not string)"
        };
    } else if (result.message !== undefined) {
        return {
            type: "IntError",
            message: result.message,
            display: `Int Error: ${result.message}`
        };
    }
    
    return { error: "Unknown value type result" };
}

export function processReferenceType(result) {
    console.log("JS received reference type result:", result);
    
    if (result.content !== undefined) {
        return {
            type: "StringSuccess",
            content: result.content,
            metadata: result.metadata,
            display: `String Success: "${result.content}" (${result.metadata})`,
            note: "Both content and metadata are JSON strings"
        };
    } else {
        return {
            type: "StringEmpty",
            display: "String Empty case received"
        };
    }
}

export async function callCSharpWithValueType() {
    console.log("JS calling C# method with value type");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleValueTypeFromJS", { value: 777 });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithReferenceType() {
    console.log("JS calling C# method with reference type");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleReferenceTypeFromJS", { content: "from JS", metadata: "test" });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

