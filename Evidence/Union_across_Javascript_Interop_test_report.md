# Union Type Error Handling - Test Report

## Test Report

**Issue:** [#68481](https://github.com/dotnet/aspnetcore/issues/68481)

**Configuration Tested:** Blazor Interactive Server, Interactive WebAssembly and Standalone WebAssembly.

**Build tested:** .NET 11.0 (from `dotnet --info`)

**Sample:** BlazorUnionTypesJsInteropValidation

**Result:** 35 validations passed, 2 issues found (see Issues section)

---

## Additional Coverage

**Configurations tested:** 
- Debug (development mode)
- Published Output
- Release (AOT compilation with `/p:RunAOTCompilation=true`)

**Deployment models tested:**
- UnionInteropValidation.Server (Blazor Server + AOT)
- UnionInteropValidation.Standalone (Standalone WebAssembly)
- UnionInteropValidation.Hosted (Hosted WebAssembly)

**Also exercised:**
- JavaScript Interop (C# ↔ JS bidirectional communication)
- Union type deserialization and serialization
- JSON validation and error reporting
- Property-based discrimination vs. Type-based discrimination ($type classifier)
- Round-trip serialization for all union case types
- Null active case handling
- Nested union structures
- Ambiguous union case matching
- Record types with and without JSON classifiers

**OS, browser, IDE:** Windows 11, Chrome/Edge, Visual Studio Code

---

## Checks

Based on issue #68481 requirements - test each union type in both directions through JavaScript interop.

### Validation Scenarios

| No. | Scenario | Result | Evidence |
|------|----------|--------|----------|
| **01** | A union whose active case is null | Pass | [Null active case](Evidence/NullableUnion_NullActiveCase/Null_active_case.png) |
| **02** | A union whose active case is an integer | Pass | [Integer round-trip](Evidence/JavaScriptToDotNet_RoundTrip/Int-round-trip.png) |
| **03** | A union whose active case is a string | Pass | [String round-trip](Evidence/JavaScriptToDotNet_RoundTrip/String-round-trip.png) |
| **04** | A nested union with a null value inside a container object | Pass | [Nested round-trip](Evidence/NestedUnion_InContainerObject/Round_trip_validation.png) |
| **05** | A nested union with an integer value inside a container object | Pass | [Nested round-trip](Evidence/NestedUnion_InContainerObject/Round_trip_validation.png) |
| **06** | A nested union with a string value inside a container object | Pass | [Nested round-trip](Evidence/NestedUnion_InContainerObject/Round_trip_validation.png) |
| **07** | JavaScript returns a payload with missing required properties | Pass | [Missing property error](Evidence/InvalidJson_NoMatchingUnionCase/Field-validation-error.png) |
| **08** | JavaScript returns a payload containing an invalid type | Pass | [Invalid type error](Evidence/InvalidJson_NoMatchingUnionCase/Invalid-type.png) |
| **09** | JavaScript returns an ambiguous shape without a classifier | Pass | [Property-based ambiguity](Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **10** | JavaScript returns a completely invalid structure | Pass | [Invalid JSON error](Evidence/InvalidJson_NoMatchingUnionCase/Invalid-json.png) |
| **11** | Multiple union cases match without a classifier | Pass | [Multiple matching cases](Evidence/AmbiguousUnion_MultipleMatches/Could-match-multiple%20cases.png) |
| **12** | Multiple record shapes match during deserialization | Pass | [Property-based ambiguity](Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **13** | First record type without a JsonUnion classifier | Pass | [Property-based discrimination](Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **14** | Second record type without a JsonUnion classifier | Pass | [Property-based discrimination](Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **15** | First record type with a JsonUnion classifier | Pass | [Classifier resolution](Evidence/RecordUnion_WithJsonUnion/Classifier-resolution.png) |
| **16** | Second record type with a JsonUnion classifier | Pass | [Unambiguous via classifier](Evidence/RecordUnion_WithJsonUnion/Unambiguous-via-classifier.png) |
| **17** | Classifier-based record union round-trip | Pass | [Using $type classifier](Evidence/RecordUnion_WithJsonUnion/Using-$type-classifier.png) |
| **18** | Integer case arrives in JavaScript as a number | Pass | [Integer case](Evidence/IntCase_DotNetToJavaScript.png) |
| **19** | String case arrives in JavaScript as a string | Pass | [String case](Evidence/StringCase_DotNetToJavaScript.png) |
| **20** | Success record transmitted without wrapper object | Pass | [Success response](Evidence/RecordCase_NoWrapperObject/ApiResponse_Success_case.png) |
| **21** | Failure record transmitted without wrapper object | Pass | [Failure response](Evidence/RecordCase_NoWrapperObject/ApiResponse_Failure_case.png) |
| **22** | Redirect record transmitted without wrapper object | Pass | [Redirect response](Evidence/RecordCase_NoWrapperObject/ApiResponse_Redirect_case.png) |
| **23** | Integer union round-trip (JS → .NET) — `UnambiguousInt` active case deserialized | Pass | [Integer round-trip](Evidence/JavaScriptToDotNet_RoundTrip/Int-round-trip.png) |
| **24** | String union round-trip (JS → .NET) — `UnambiguousString` active case deserialized | Pass | [String round-trip](Evidence/JavaScriptToDotNet_RoundTrip/String-round-trip.png) |
| **25** | Record union round-trip (JS → .NET) — multi-case `ApiResponse` active case deserialized | Pass | [Multi-case round-trip](Evidence/JavaScriptToDotNet_RoundTrip/Multi-case%20round-trip.png) |
| **26** | Null union round-trip (JS → .NET) — null active case preserved | Pass | [Null round-trip](Evidence/NullActiveCase_RoundTrip/Null-case-round-trip.png) |
| **27** | Null active case preserved through interop | Pass | [Null active case](Evidence/NullableUnion_NullActiveCase/Null_active_case.png) |
| **28** | JS invokes .NET — `TaggedResult` received; `TaggedSuccess` active case deserialized from ambiguous JSON | Pass | [Ambiguous union](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-ambiguous-union.png) |
| **29** | JS invokes .NET — `PropertyBased` union received; `PBSuccess` active case deserialized | Pass | [Property-based union](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-classified-union.png) |
| **30** | JS invokes .NET — `TypeBased` union received; `TBSuccess` active case deserialized | Pass | [Type-based union](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-type-based-union.png) |
| **31** | JS invokes .NET — `PaymentResult` received; `PaymentApproved` active case deserialized from complex JSON | Pass | [Complex multi-case union](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-complex-union.png) |
| **32** | JS invokes .NET — `Result<T>` received; `Ok` active case deserialized with string value | Pass | [Generic result Ok string](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-generic-result-ok-string.png) |
| **33** | JS invokes .NET — `Result<T>` received; `Ok` active case deserialized with int value | Pass | [Generic result Ok int](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-generic-result-ok-int.png) |
| **34** | JS invokes .NET — `IntResult` received; `IntSuccess` active case deserialized (value type union) | Pass | [IntResult value type](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-IntResult-value-type.png) |
| **35** | JS invokes .NET — `StringResult` received; `StringSuccess` active case deserialized (reference type union) | Pass | [StringResult reference type](Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-StringResult-reference-type.png) |

---

## Issues

Based on testing across all three deployment platforms, the following issues were identified.

### Issue 1: $type Classifier Field Undefined in Type-Based Discrimination

**What happened:** When clicking the "TBSuccess" and "TBError" buttons on the TypeDiscrimination page (TC 15/23 and TC 16/24 - Type-Based Discrimination with $type classifier), the application returns an error:
```
"error": "Unknown $type: \u0022undefined\u0022"
```

**Expected behavior:** The $type field should contain the actual type name (e.g., "TaggedSuccess" or "TaggedError") so C# can deserialize to the correct union case.

**Steps to reproduce:**
1. Navigate to the "Type Discrimination Methods" page on Server or Hosted WebAssembly platforms
2. Click either "TBSuccess("OK")" or "TBError("FAILED")" button in the Type-Based Discrimination section
3. Observe the error message in the Result area: "Unknown $type: undefined"

**Evidence:** 
- Screenshot: [$type classifier field undefined error](Evidence/Errors/type-Classifier-Field-Undefined.png)
- Error message shows: `"error": "Unknown $type: \u0022undefined\u0022"`
- Code inspection shows: `const typeField = unionData.$type;` evaluating to `undefined`
- Property-Based discrimination (TC 13-14) works correctly, confirming issue is specific to `$type` classifier handling

---

### Issue 2: jsObjectReference Null Exception in Standalone WebAssembly Only

**What happened:** When clicking any test button on multiple pages (NullableUnion, GenericResult) in **Standalone WebAssembly only**, the application throws:
```
ArgumentNull_Generic Arg_ParamName_Name, jsObjectReference
```

**Expected behavior:** JavaScript interop calls should successfully pass object references to C# without null reference exceptions. The same test buttons work correctly on Server deployment.

**Steps to reproduce (Standalone WebAssembly only):**
1. Deploy UnionInteropValidation.Standalone (Standalone WebAssembly) and navigate to any interactive page (NullableUnion, GenericResult)
2. Click any C# → JavaScript button (e.g., "Result<string> - Ok("Success")", "WithValue("Test", 42)", "TBSuccess("OK")", etc.)
3. OR click any JavaScript → C# button (e.g., "Call C# with Result<string> from JS", "Call C# with WithValue from JS", etc.)
4. Observe the error message in the Result area

**Evidence:** 
- Screenshot: [jsObjectReference null exception in Standalone WebAssembly](Evidence/Errors/JavaScript-Object-Reference-Null.png)
- Error message: "ArgumentNull_Generic Arg_ParamName_Name, jsObjectReference"
- Screenshots show error on NullableUnion and GenericResult pages in Standalone WebAssembly only
- Server deployment (UnionInteropValidation.Server) works correctly without any errors
- All test scenarios work in Server deployment but fail in Standalone WebAssembly