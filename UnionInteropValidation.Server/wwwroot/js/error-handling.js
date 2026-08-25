// Error Handling Test Scenarios for Union Type Validation
// TC 07-10: InvalidJson_NoMatchingUnionCase (integrates with C# union deserialization)
// TC 19-22: InvalidJson_ErrorReporting (reports actual C# validation errors)

/**
 * Test TC 07: Missing Required Property
 * Tests deserialization of empty JSON to SimpleResult union
 */
export async function testMissingProperty(data) {
    try {
        const jsonString = JSON.stringify(data || {});
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
            'TryDeserializeToSimpleResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`TC 07 - Missing Required Property Error: ${error.message}`);
    }
}

/**
 * Test TC 08: Invalid Type
 * Tests deserialization with wrong type to SimpleResult union
 */
export async function testInvalidType(data) {
    try {
        const jsonString = JSON.stringify(data || { value: 12345 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
            'TryDeserializeToSimpleResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`TC 08 - Invalid Type Error: ${error.message}`);
    }
}

/**
 * Test TC 09: Ambiguous Without Classifier
 * Tests deserialization to SimpleResult (ambiguous: both SimpleSuccess and SimpleError match)
 */
export async function testAmbiguousNoClassifier(data) {
    try {
        const jsonString = JSON.stringify(data || { value: "test" });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
            'TryDeserializeToSimpleResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`TC 09 - Ambiguous Without Classifier Error: ${error.message}`);
    }
}

/**
 * Test TC 10: Completely Invalid JSON
 * Tests deserialization with random fields to SimpleResult union
 */
export async function testCompletelyInvalid(data) {
    try {
        const jsonString = JSON.stringify(data || { randomField: "invalid", anotherField: 123 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
            'TryDeserializeToSimpleResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`TC 10 - Completely Invalid JSON Error: ${error.message}`);
    }
}

/**
 * Test TC 19: Missing Required Field Validation
 * Tests deserialization to UnionResult (complex type requiring specific fields)
 */
export async function testFieldValidation(data) {
    try {
        const jsonString = JSON.stringify(data || {});
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
            'TryDeserializeToUnionResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`TC 19 - Missing Required Field Validation Error: ${error.message}`);
    }
}

/**
 * Test TC 20: Type Mismatch Validation
 * Tests deserialization with wrong types to UnionResult
 */
export async function testTypeMismatch(data) {
    try {
        const jsonString = JSON.stringify(data || { message: 12345, code: "wrong" });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
            'TryDeserializeToUnionResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`TC 20 - Type Mismatch Validation Error: ${error.message}`);
    }
}

/**
 * Test TC 21: No Matching Union Case Validation
 * Tests deserialization with completely unknown structure to UnionResult
 */
export async function testNoMatchingCase(data) {
    try {
        const jsonString = JSON.stringify(data || { unknownField: "value", anotherUnknown: 123 });
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
            'TryDeserializeToUnionResult',
            jsonString
        );
        const parsed = JSON.parse(result);
        if (!parsed.success) {
            throw new Error(parsed.message || parsed.error);
        }
        return parsed;
    } catch (error) {
        throw new Error(`TC 21 - No Matching Union Case Validation Error: ${error.message}`);
    }
}

/**
 * Test TC 22: Malformed JSON Validation
 * Tests JSON parsing validation directly
 */
export async function testMalformedJson() {
    try {
        const malformedJson = "{ invalid json }";
        const result = await window.DotNet.invokeMethodAsync(
            'UnionInteropValidationServer',
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
        throw new Error(`TC 22 - Malformed JSON Validation Error: ${error.message}`);
    }
}
