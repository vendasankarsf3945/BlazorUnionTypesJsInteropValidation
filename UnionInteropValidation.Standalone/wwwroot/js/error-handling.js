// Error Handling Test Scenarios for Union Type Validation



/**
 * Tests required-member validation after ApiResponse case selection
 */
export async function testMissingProperty(data) {
    try {
        const jsonString = JSON.stringify(data || {});
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'TryDeserializeToApiResponse',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`Missing Required Property Error: ${error.message}`);
    }
}

/**
 * Tests invalid property type after ApiResponse case selection
 */
export async function testInvalidType(data) {
    try {
        const jsonString = JSON.stringify(data || { value: 12345 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'TryDeserializeToApiResponse',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`Invalid Type Error: ${error.message}`);
    }
}

/**
 * Tests deserialization to SimpleResult (ambiguous: both SimpleSuccess and SimpleError match)
 */
export async function testAmbiguousNoClassifier(data) {
    try {
        const jsonString = JSON.stringify(data || { value: "test" });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'TryDeserializeToSimpleResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`Ambiguous Without Classifier Error: ${error.message}`);
    }
}

/**
 * Tests ApiResponse classifier rejection of an unknown shape
 */
export async function testCompletelyInvalid(data) {
    try {
        const jsonString = JSON.stringify(data || { randomField: "invalid", anotherField: 123 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'TryDeserializeToApiResponse',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`Completely Invalid JSON Error: ${error.message}`);
    }
}

/**
 * Tests required fields on a selected ApiResponse case
 */
export async function testFieldValidation(data) {
    try {
        const jsonString = JSON.stringify(data || {});
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'TryDeserializeToApiResponse',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`Missing Required Field Validation Error: ${error.message}`);
    }
}

/**
 * Tests wrong property types on a selected ApiResponse case
 */
export async function testTypeMismatch(data) {
    try {
        const jsonString = JSON.stringify(data || { message: 12345, code: "wrong" });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'TryDeserializeToApiResponse',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`Type Mismatch Validation Error: ${error.message}`);
    }
}

/**
 * Tests deserialization with a completely unknown ApiResponse structure
 */
export async function testNoMatchingCase(data) {
    try {
        const jsonString = JSON.stringify(data || { unknownField: "value", anotherUnknown: 123 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'TryDeserializeToApiResponse',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`No Matching Union Case Validation Error: ${error.message}`);
    }
}

/**
 * Tests JSON parsing validation directly
 */
export async function testMalformedJson() {
    try {
        const malformedJson = "{ invalid json }";
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Standalone',
            'ValidateJsonStructure',
            malformedJson
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`Malformed JSON Validation Error: ${error.message}`);
    }
}

