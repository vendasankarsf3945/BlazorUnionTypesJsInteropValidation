/**
 * Nullable Union — union(int?, string)
 * int? null case arrives as JSON null; int? 42 as a number; string case as a string.
 * This tests that a null active case round-trips correctly across the boundary.
 */

export function processNullable(value) {
    // value is null, a number, or a string — never a wrapper object
    console.log("JS received NullableUnion active case:", value, "| JSON type:", typeof value);
    if (value === null) {
        return { case: "int? (null active case)", receivedValue: null };
    } else if (typeof value === "number") {
        return { case: "int?", receivedValue: value };
    } else {
        return { case: "string", receivedValue: value };
    }
}

export async function callCSharpWithNullableUnion() {
    // Send raw 42 — C# receives NullableUnion with int? active case
    console.log("JS → C#: sending int? case (42)");
    try {
        const returned = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Server", "HandleNullableFromJS", 42);
        console.log("C# → JS: returned union active case:", returned);
        return { sent: 42, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

export async function callCSharpWithNullValue() {
    // Send null — C# receives NullableUnion with null int? active case
    console.log("JS → C#: sending null (int? null case)");
    try {
        const returned = await DotNet.invokeMethodAsync(
            "UnionInteropValidation.Server", "HandleNullableFromJS", null);
        console.log("C# → JS: returned union active case:", returned);
        return { sent: null, received: returned };
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}
