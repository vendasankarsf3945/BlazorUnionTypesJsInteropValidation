/**
 * Ambiguous Shapes - Test with/without JsonUnion classifier
 * Demonstrates the difference between ambiguous and clarified union cases
 */

export function processAmbiguous(unionData) {
    console.log("JS received ambiguous union (no type field):", unionData);
    
    // Without $type field, JSON looks identical: { "value": "..." }
    // We can't tell if it's SimpleSuccess or SimpleError!
    return {
        warning: "AMBIGUOUS: Cannot distinguish from JSON alone!",
        value: unionData.value,
        note: "JSON should have included $type field for disambiguation",
        receivedJson: JSON.stringify(unionData)
    };
}

export function processTagged(unionData) {
    console.log("JS received tagged union (with $type field):", unionData);
    
    const typeField = unionData.$type;
    
    if (typeField === "success") {
        return {
            type: "TaggedSuccess",
            value: unionData.value,
            display: `✓ Success: "${unionData.value}"`,
            note: `Discriminated by $type field: "${typeField}"`,
            receivedJson: JSON.stringify(unionData)
        };
    } else if (typeField === "error") {
        return {
            type: "TaggedError",
            value: unionData.value,
            display: `✗ Error: "${unionData.value}"`,
            note: `Discriminated by $type field: "${typeField}"`,
            receivedJson: JSON.stringify(unionData)
        };
    } else {
        return {
            error: `Unknown $type: "${typeField}"`,
            receivedJson: JSON.stringify(unionData)
        };
    }
}

export async function callCSharpWithAmbiguous() {
    console.log("JS calling C# method with ambiguous union");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidationWasm.Client", "HandleAmbiguousFromJS", { value: "success" });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}