/**
 * Multi-Case Union - Test 3+ distinct cases
 * Demonstrates API response handling with multiple outcome types
 */

export function processApiResponse(response) {
    console.log("JS received ApiResponse active case:", JSON.stringify(response));
    
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
    const payload = { statusCode: 200, data: "Success from JS", timestamp: new Date().toISOString() };
    console.log("JS → C# HandleApiResponseFromJS:", JSON.stringify(payload));
    try {
        const returned = await DotNet.invokeMethodAsync("UnionInteropValidation.Hosted.Client", "HandleApiResponseFromJS", payload);
        console.log("C# → JS returned ApiResponse:", JSON.stringify(returned));
        return { sent: payload, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

