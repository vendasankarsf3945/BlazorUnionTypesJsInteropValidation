# Union Type Error Handling - Test Report

## Test Report

**Issue:** [#68481](https://github.com/dotnet/aspnetcore/issues/68481)

**Configuration Tested:** Blazor Server, Hosted WebAssembly and Standalone WebAssembly.

**Build tested:** 11.0.100-preview.7.26381.103 (from `dotnet --info`)

**Also exercised:** Published Release output, Trimmed WebAssembly client
**OS, browser, IDE:** Windows 10, Microsoft Edge, VisualStudio code 

**Sample:** [BlazorUnionTypesJsInteropValidation](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation)

**Result:** 37 validations passed

---

## Checks

Based on issue #68481 requirements - test each union type in both directions through JavaScript interop.

### Validation Scenarios

| No. | Scenario | Result | Evidence |
|------|----------|--------|----------|
| **01** | `NullableUnion(int?, string)` — Null active case preserved across interop (`null` round-trip) | Pass | [Null active case](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/NullableUnion_NullActiveCase/Null_active_case.png) |
| **02** | `UnambiguousUnion(int, string)` — Primitive round-trip for `int` (JS→C# and C#→JS) | Pass | [Integer round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JavaScriptToDotNet_RoundTrip/Int-round-trip.png) |
| **03** | `UnambiguousUnion(int, string)` — Primitive round-trip for `string` (JS→C# and C#→JS) | Pass | [String round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JavaScriptToDotNet_RoundTrip/String-round-trip.png) |
| **04** | `NestedUnion(UserData, ErrorData)` inside `Container.Payload` — nested value `null` preserved | Pass | [Nested null payload](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/NestedUnion_InContainerObject/Nested_null_payload.png) |
| **05** | `NestedUnion(UserData, ErrorData)` inside `Container.Payload` — nested `UserData` preserved | Pass | [Nested user payload](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/NestedUnion_InContainerObject/Nested_user_payload.png) |
| **06** | `NestedUnion(UserData, ErrorData)` inside `Container.Payload` — nested `ErrorData` preserved | Pass | [Nested error payload](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/NestedUnion_InContainerObject/Nested_error_payload.png) |
| **07** | JavaScript → .NET: payload missing required properties produces validation error | Pass | [Missing property error](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/InvalidJson_NoMatchingUnionCase/Field-validation-error.png) |
| **08** | JavaScript → .NET: payload with an invalid property type produces a type error | Pass | [Invalid type error](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/InvalidJson_NoMatchingUnionCase/Invalid-type.png) |
| **09** | Ambiguous record-shaped payload without a classifier — must surface explicit ambiguity error (property-based) | Pass | [Property-based ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **10** | Completely invalid JSON structure is rejected before union selection | Pass | [Invalid JSON error](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/InvalidJson_NoMatchingUnionCase/Invalid-json.png) |
| **11** | Multiple union cases match (no classifier) — named ambiguity error observed | Pass | [Multiple matching cases](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/AmbiguousUnion_MultipleMatches/Match-multiple%20cases.png) |
| **12** | Multiple record shapes match during deserialization demonstrating ambiguity | Pass | [Property-based ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **13** | First record type (no classifier) — property-based discrimination demonstrates ambiguous matching | Pass | [Property-based discrimination](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **14** | Second record type (no classifier) — property-based discrimination demonstrates ambiguous matching | Pass | [Property-based discrimination](Evidence/AmbiguousUnion_MultipleMatches/Property-based-match-ambiguity.png) |
| **15** | Classifier-backed record union (`[JsonUnion(TypeClassifier=...)]`) — first classifier-resolved case (JS→C#) | Pass | [Classifier resolution](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordUnion_WithJsonUnion/Classifier-resolution.png) |
| **16** | Classifier-backed record union (`[JsonUnion(TypeClassifier=...)]`) — second classifier-resolved case (JS→C#) | Pass | [Unambiguous via classifier](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordUnion_WithJsonUnion/Unambiguous-via-classifier.png) |
| **17** | Classifier-backed record union — Round-trip when JavaScript supplies `$type` discriminator | Pass | [Using $type classifier](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordUnion_WithJsonUnion/Using-$type-classifier.png) |
| **18** | C# → JS: integer union case sent as raw JSON number (no wrapper object) | Pass | [Integer case](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/IntCase_DotNetToJavaScript.png) |
| **19** | C# → JS: string union case sent as raw JSON string (no wrapper object) | Pass | [String case](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/StringCase_DotNetToJavaScript.png) |
| **20** | ApiResponse `SuccessResponse` transmitted as case properties (no wrapper object) | Pass | [Success response](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordCase_NoWrapperObject/ApiResponse_Success_case.png) |
| **21** | ApiResponse `FailureResponse` transmitted as case properties (no wrapper object) | Pass | [Failure response](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordCase_NoWrapperObject/ApiResponse_Failure_case.png) |
| **22** | ApiResponse `RedirectResponse` transmitted as case properties (no wrapper object) | Pass | [Redirect response](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordCase_NoWrapperObject/ApiResponse_Redirect_case.png) |
| **23** | `ApiResponse` multi-case record behavior — C#→JS sends case properties without wrapper; JS→C# round-trip into correct active case | Pass | [Multi-case round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JavaScriptToDotNet_RoundTrip/Multi-case%20round-trip.png) |
| **24** | JS → .NET: `NullableUnion` null active case preserved on deserialization | Pass | [Null round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/NullActiveCase_RoundTrip/Null-case-round-trip.png) |
| **25** | JS invokes .NET: `TaggedResult` deserializes the `TaggedSuccess` or `TaggedError` depending on classifier | Pass | [Ambiguous union](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-ambiguous-union.png) |
| **26** | JS invokes .NET: `PropertyBased` union throws expected ambiguity error when cases overlap | Pass | [Property-based union](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-no-classified-union.png) |
| **27** | JS invokes .NET: `TypeBased` union deserializes cases according to `$type` discriminator supplied by JavaScript | Pass | [Type-based union](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-type-based-union.png) |
| **28** | JS invokes .NET: `PaymentResult` deserializes `PaymentApproved` from a complex record payload | Pass | [Complex multi-case union](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-complex-union.png) |
| **29** | JS invokes .NET: generic `Result<string>` deserializes `Ok<string>` payload correctly (JS→C#) | Pass | [Generic result Ok string](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-generic-result-ok-string.png) |
| **30** | JS invokes .NET: generic `Result<int>` deserializes `Ok<int>` payload correctly (JS→C#) | Pass | [Generic result Ok int](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-generic-result-ok-int.png) |
| **31** | JS invokes .NET: `IntResult` deserializes `IntSuccess` value-type payload correctly | Pass | [IntResult value type](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-IntResult-value-type.png) |
| **32** | JS invokes .NET: `StringResult` deserializes `StringSuccess` reference-type payload correctly | Pass | [StringResult reference type](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JSInvokesDotNet_UnionParameter/JS-invokes-C%23-with-StringResult-reference-type.png) |
| **33** | JS → C#: union-level `[JsonUnion(TypeClassifier=...)]` resolves same-shape record deserialization correctly (must-hold) | Pass | [Classifier resolution](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordUnion_WithJsonUnion/Classifier-resolution.png) |
| **34** | C# → JS: Preview behavior — `$type` discriminator is not emitted; only active-case JSON crosses the boundary | Pass | [String case](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/StringCase_DotNetToJavaScript.png) |
| **35** | JS → C#: JavaScript may add `$type` to aid classifier-based deserialization on the .NET side | Pass | [Using $type classifier](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/RecordUnion_WithJsonUnion/Using-$type-classifier.png) |
| **36** | JS → .NET: `PropertyBased(PBSuccess, PBError)` without a classifier produces ambiguity error | Pass | [Multiple matching cases](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/AmbiguousUnion_MultipleMatches/Match-multiple%20cases.png) |
| **37** | JS invokes .NET and receives a union return value — JS→C#→JS round-trip for a union parameter and return | Pass | [Multi-case round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/JavaScriptToDotNet_RoundTrip/Multi-case%20round-trip.png) |

## Test Coverage and Required Builds

All validation scenarios in this report were exercised on the three deployment models in this workspace:

- `UnionInteropValidation.Server` — Blazor Server (Debug/Release)
- `UnionInteropValidation.Standalone` — Standalone WebAssembly (Debug/Release/AOT)
- `UnionInteropValidation.Hosted` — Hosted WebAssembly (Debug/Release/AOT)


## Release Publish

Command:

```bash
dotnet publish -c Release
```

Output:

Build succeeded.
Published to:
bin\Release\net11.0\publish\

## AOT Publish

Command:

```bash
dotnet publish -c Release -p:RunAOTCompilation=true
```

Notes:

- WASM AOT builds were produced for Standalone and Hosted projects during validation.

---