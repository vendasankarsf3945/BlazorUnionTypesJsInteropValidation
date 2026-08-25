/**
 * Type Discrimination - Compare property-based vs type-based discrimination
 * Demonstrates how to distinguish between cases with identical structures
 */

export function processPropertyBased(result) {
    console.log("JS received property-based union:", result);
    
    return {
        type: "PropertyBased",
        result: result.result,
        warning: "Property-based: JSON structure identical for both cases",
        note: "Cannot distinguish PBSuccess from PBError by JSON alone - need application logic",
        receivedJson: JSON.stringify(result)
    };
}

export function processTypeBased(result) {
    console.log("JS received type-based union:", result);
    const typeField = result.$type;
    
    if (typeField === "ok") {
        return {
            type: "TBSuccess",
            result: result.result,
            typeField: typeField,
            display: `Type-Based Success`,
            note: `Discriminated by $type field: "${typeField}"`,
            receivedJson: JSON.stringify(result)
        };
    } else if (typeField === "fail") {
        return {
            type: "TBError",
            result: result.result,
            typeField: typeField,
            display: `Type-Based Error`,
            note: `Discriminated by $type field: "${typeField}"`,
            receivedJson: JSON.stringify(result)
        };
    }
    
    return { error: `Unknown $type: "${typeField}"` };
}

export async function callCSharpWithPropertyBased() {
    console.log("JS calling C# method with property-based union");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Server", "HandlePropertyBasedFromJS", { result: "success from JS" });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithTypeBased() {
    console.log("JS calling C# method with type-based union");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Server", "HandleTypeBasedFromJS", { result: "success from JS" });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}
