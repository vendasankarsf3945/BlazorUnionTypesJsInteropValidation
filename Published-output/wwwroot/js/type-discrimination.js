/**
 * Type Discrimination — property-based vs JsonTypeClassifierFactory
 * PropertyBased(PBSuccess, PBError): same JSON shape, no classifier — ambiguous.
 * TypeBased(TBSuccess, TBError): classifier resolves JS→C#.
 * NOTE: .NET 11 Preview 7 does NOT emit $type in the C#→JS direction.
 * $type only travels JS→C# (JS adds it; classifier reads it).
 */

export function processPropertyBased(value) {
    console.log("JS received PropertyBased (no classifier):", JSON.stringify(value));
    return {
        type: "PropertyBased (ambiguous)",
        result: value.result,
        warning: "Same JSON shape for PBSuccess and PBError — cannot distinguish without classifier",
        receivedJson: JSON.stringify(value)
    };
}

export function processTypeBased(value) {
    // C# does NOT emit $type in Preview 7 — JSON is just the case properties
    console.log("JS received TypeBased (no $type in C#→JS direction):", JSON.stringify(value));
    return {
        receivedJson: JSON.stringify(value),
        note: "$type absent in C#→JS — classifier handles JS→C# only (JS manually adds $type)"
    };
}

export async function callCSharpWithPropertyBased() {
    const payload = { result: "success from JS (ambiguous)" };
    console.log("JS → C# HandlePropertyBasedFromJS:", JSON.stringify(payload));
    try {
        const result = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Server", "HandlePropertyBasedFromJS", payload);
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Ambiguity error from C#:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithTypeBased() {
    return callCSharpWithTypeBasedCase("TBSuccess");
}

export async function callCSharpWithTypeBasedCase(discriminator) {
    const payload = { result: `${discriminator ?? "missing"} from JS` };
    if (discriminator !== null) payload.$type = discriminator;
    console.log("JS → C# HandleTypeBasedFromJS:", JSON.stringify(payload));
    try {
        const result = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Server", "HandleTypeBasedFromJS", payload);
        console.log("C# returned TypeBased:", JSON.stringify(result));
        return result;
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}