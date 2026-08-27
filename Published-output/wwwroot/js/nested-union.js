/**
 * Nested Union — NestedUnion(UserData, ErrorData) inside a Container
 * The active case's record properties appear directly on container.payload — no wrapper object.
 * Null payload tests the "union nested inside larger object whose property is null" scenario.
 */

export function processPrimitive(container) {
    // NullableUnion(int?,string) nested inside NullableContainer — value is null, number, or string
    console.log("JS received NullableContainer:", JSON.stringify(container));
    return {
        containerId: container.id,
        value: container.value,
        jsonType: container.value === null ? "null" : typeof container.value,
        receivedJson: JSON.stringify(container)
    };
}

export function processNested(containerData) {
    console.log("JS received Container:", JSON.stringify(containerData));
    const payload = containerData.payload;
    if (payload === null || payload === undefined) {
        return { containerId: containerData.id, payload: null, note: "null NestedUnion (no active case)" };
    }
    // Record case properties appear directly — no union wrapper object
    return {
        containerId: containerData.id,
        receivedPayload: payload,
        receivedJson: JSON.stringify(payload)
    };
}

export async function callCSharpWithNestedUnion() {
    // Send Container with UserData nested union case
    const container = { id: "from-js-123", payload: { name: "John", email: "john@example.com" } };
    console.log("JS → C# HandleNestedFromJS:", JSON.stringify(container));
    try {
        const returned = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Server", "HandleNestedFromJS", container);
        console.log("C# → JS returned Container:", JSON.stringify(returned));
        return { sent: container, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}
