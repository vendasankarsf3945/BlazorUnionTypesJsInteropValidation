/**
 * Ambiguous Shapes — record unions with and without [JsonUnion] classifier
 */

export function processAmbiguous(value) {
    console.log("JS received SimpleResult (no classifier):", JSON.stringify(value));
    return {
        warning: "AMBIGUOUS: SimpleSuccess and SimpleError have identical JSON shape",
        receivedJson: JSON.stringify(value),
        note: "Add [JsonUnion(TypeClassifier=...)] to the union type to resolve"
    };
}

export function processTagged(value) {
    // C# does NOT emit $type in Preview 7 — JSON is just the case properties
    console.log("JS received TaggedResult (no $type in C#→JS direction):", JSON.stringify(value));
    return {
        receivedJson: JSON.stringify(value),
        note: "$type absent in C#→JS — classifier handles JS→C# only (JS manually adds $type)"
    };
}

export async function callCSharpWithAmbiguous() {
    const payload = { value: "from JS (no $type)" };
    console.log("JS → C# HandleSimpleFromJS:", JSON.stringify(payload));
    try {
        const result = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Standalone", "HandleSimpleFromJS", payload);
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Ambiguity error from C#:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithTagged() {
    const payload = { $type: "TaggedSuccess", value: "from JS (tagged)" };
    console.log("JS → C# HandleTaggedFromJS:", JSON.stringify(payload));
    try {
        const result = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Standalone", "HandleTaggedFromJS", payload);
        console.log("C# returned TaggedResult:", JSON.stringify(result));
        return result;
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

