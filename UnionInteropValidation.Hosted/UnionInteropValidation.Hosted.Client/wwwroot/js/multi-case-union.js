/**
 * Multi-Case Union - Test 3+ distinct cases
 * Demonstrates API response handling with multiple outcome types
 */

export function processApiResponse(response) {
    console.log("JS received API response:", response);
    
    if (response.url !== undefined) {
        return {
            type: "RedirectResponse",
            url: response.url,
            redirectCode: response.redirectCode,
            display: `Redirect to ${response.url} (${response.redirectCode})`
        };
    } else if (response.errorMessage !== undefined) {
        return {
            type: "FailureResponse",
            statusCode: response.statusCode,
            errorMessage: response.errorMessage,
            errorCode: response.errorCode,
            display: `Error ${response.statusCode}: ${response.errorCode} - ${response.errorMessage}`
        };
    } else if (response.data !== undefined) {
        return {
            type: "SuccessResponse",
            statusCode: response.statusCode,
            data: response.data,
            timestamp: response.timestamp,
            display: `Success ${response.statusCode}: ${response.data}`
        };
    }
    return { error: "Unknown response type" };
}

export async function callCSharpWithApiResponse() {
    console.log("JS calling C# method with ApiResponse");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidationWasm.Client", "HandleApiResponseFromJS", { 
            statusCode: 200,
            data: "Success from JS",
            timestamp: new Date().toISOString()
        });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}
