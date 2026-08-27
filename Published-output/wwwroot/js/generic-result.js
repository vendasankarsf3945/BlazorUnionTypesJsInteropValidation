/**
 * Generic Result - Test Result<T> with different type parameters
 * Demonstrates generic union types work with any type parameter
 */

export function processResult(result) {
    console.log("JS received Result active case:", JSON.stringify(result));
    
    if (result.value !== undefined) {
        return {
            type: "Ok",
            value: result.value,
            valueType: typeof result.value,
            display: `Ok: ${JSON.stringify(result.value)}`
        };
    } else if (result.message !== undefined) {
        return {
            type: "Error",
            message: result.message,
            display: `Error: ${result.message}`
        };
    }
    
    return { error: "Unknown result type" };
}

export async function callCSharpWithResult() {
    const payload = { message: "Error from JS" };
    console.log("JS → C# HandleResultFromJS (Error<object>):", JSON.stringify(payload));
    try {
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Server", "HandleResultFromJS", payload);
        console.log("C# → JS returned Result:", JSON.stringify(returned));
        return { sent: payload, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithResultString() {
    const payload = { value: "Success from JS" };
    console.log("JS → C# HandleResultFromJS (Ok<string>):", JSON.stringify(payload));
    try {
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Server", "HandleResultFromJS", payload);
        console.log("C# → JS returned Result:", JSON.stringify(returned));
        return { sent: payload, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithResultInt() {
    const payload = { value: 999 };
    console.log("JS → C# HandleResultFromJS (Ok<int>):", JSON.stringify(payload));
    try {
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Server", "HandleResultFromJS", payload);
        console.log("C# → JS returned Result:", JSON.stringify(returned));
        return { sent: payload, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}
