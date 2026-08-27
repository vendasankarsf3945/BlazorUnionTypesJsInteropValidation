/**
 * Value & Reference Types - Test different fundamental types
 * Demonstrates that value types (int) and reference types (string) are properly distinguished
 */

export function processValueType(result) {
    console.log("JS received IntResult active case:", JSON.stringify(result));
    
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
    console.log("JS received StringResult active case:", JSON.stringify(result));
    
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
    const payload = { value: 777 };
    console.log("JS → C# HandleValueTypeFromJS (IntSuccess):", JSON.stringify(payload));
    try {
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleValueTypeFromJS", payload);
        console.log("C# → JS returned IntResult:", JSON.stringify(returned));
        return { sent: payload, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithReferenceType() {
    const payload = { content: "from JS", metadata: "test" };
    console.log("JS → C# HandleReferenceTypeFromJS (StringSuccess):", JSON.stringify(payload));
    try {
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleReferenceTypeFromJS", payload);
        console.log("C# → JS returned StringResult:", JSON.stringify(returned));
        return { sent: payload, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

