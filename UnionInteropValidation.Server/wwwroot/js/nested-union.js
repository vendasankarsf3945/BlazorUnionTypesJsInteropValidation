/**
 * Nested Union - Test union inside container
 * Demonstrates that unions nested in container objects serialize correctly
 */

export function processNested(containerData) {
    console.log("JS received container with nested union:", containerData);
    
    const payload = containerData.payload;
    
    if (payload.name !== undefined) {
        return {
            type: "UserData",
            containerId: containerData.id,
            name: payload.name,
            email: payload.email,
            display: `UserData: ${payload.name} <${payload.email}>`
        };
    } else if (payload.code !== undefined) {
        return {
            type: "ErrorData",
            containerId: containerData.id,
            code: payload.code,
            message: payload.message,
            display: `ErrorData: [${payload.code}] ${payload.message}`
        };
    }
    
    return { error: "Unknown payload type" };
}

export async function callCSharpWithNestedUnion() {
    console.log("JS calling C# method with nested union");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Server", "HandleNestedFromJS", { 
            id: "test-123",
            payload: { name: "John", email: "john@example.com" }
        });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}
