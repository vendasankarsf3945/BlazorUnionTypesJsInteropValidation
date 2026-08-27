// Error Handling Test Scenarios for Union Type Validation



/**
 * Tests deserialization of empty JSON to SimpleResult union
 */
export async function testMissingProperty(data) {
    try {
        const jsonString = JSON.stringify(data || {});
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Hosted.Client',
            'TryDeserializeToSimpleResult',
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
 * Tests deserialization with wrong type to SimpleResult union
 */
export async function testInvalidType(data) {
    try {
        const jsonString = JSON.stringify(data || { value: 12345 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Hosted.Client',
            'TryDeserializeToSimpleResult',
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
            'UnionInteropValidation.Hosted.Client',
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
 * Tests deserialization with random fields to SimpleResult union
 */
export async function testCompletelyInvalid(data) {
    try {
        const jsonString = JSON.stringify(data || { randomField: "invalid", anotherField: 123 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Hosted.Client',
            'TryDeserializeToSimpleResult',
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
 * Tests deserialization to UnionResult (complex type requiring specific fields)
 */
export async function testFieldValidation(data) {
    try {
        const jsonString = JSON.stringify(data || {});
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Hosted.Client',
            'TryDeserializeToUnionResult',
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
 * Tests deserialization with wrong types to UnionResult
 */
export async function testTypeMismatch(data) {
    try {
        const jsonString = JSON.stringify(data || { message: 12345, code: "wrong" });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Hosted.Client',
            'TryDeserializeToUnionResult',
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
 * Tests deserialization with completely unknown structure to UnionResult
 */
export async function testNoMatchingCase(data) {
    try {
        const jsonString = JSON.stringify(data || { unknownField: "value", anotherUnknown: 123 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidation.Hosted.Client',
            'TryDeserializeToUnionResult',
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
            'UnionInteropValidation.Hosted.Client',
            'ValidateJsonStructure',
            malformedJson,
            'SimpleResult'
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

