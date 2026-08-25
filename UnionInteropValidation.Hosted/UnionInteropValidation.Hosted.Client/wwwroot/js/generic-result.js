/**
 * Generic Result - Test Result<T> with different type parameters
 * Demonstrates generic union types work with any type parameter
 */

export function processResult(result) {
    console.log("JS received generic result:", result);
    
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
    console.log("JS calling C# method with Result<T>");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleResultFromJS", { message: "Error from JS" });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithResultString() {
    console.log("JS calling C# method with Result<string> - Ok case");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleResultFromJS", { value: "Success from JS" });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithResultInt() {
    console.log("JS calling C# method with Result<int> - Ok case");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleResultFromJS", { value: 999 });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

