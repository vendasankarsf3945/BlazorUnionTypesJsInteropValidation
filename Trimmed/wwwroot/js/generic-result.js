/**
 * Generic Result — Result<T> union
 * Ok<T>: { "value": T } | Error<T>: { "message": "..." } — self-discriminating by field name.
 */

export function processResult(result) {
    console.log("JS received Result:", JSON.stringify(result));
    if (result.value !== undefined) {
        return { case: "Ok", value: result.value, jsonType: typeof result.value, receivedJson: JSON.stringify(result) };
    } else if (result.message !== undefined) {
        return { case: "Error", message: result.message, receivedJson: JSON.stringify(result) };
    }
    return { error: "Unknown result type" };
}

export async function callCSharpWithResult() {
    const payload = { message: "Error from JS" };
    console.log("JS → C# HandleResultFromJS (Error<object>):", JSON.stringify(payload));
    try {
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleResultFromJS", payload);
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
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleResultFromJS", payload);
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
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleResultFromJS", payload);
        console.log("C# → JS returned Result:", JSON.stringify(returned));
        return { sent: payload, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

