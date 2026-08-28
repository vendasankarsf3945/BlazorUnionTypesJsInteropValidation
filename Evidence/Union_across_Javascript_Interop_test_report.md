# Union Type Error Handling - Test Report

## Test Report

**Issue:** [#68481](https://github.com/dotnet/aspnetcore/issues/68481)

**Configuration Tested:** Blazor Server, Hosted WebAssembly and Standalone WebAssembly.

**Build tested:** 11.0.100-preview.7.26381.103 (from `dotnet --info`)

**Also exercised:** Published Release output, Trimmed WebAssembly client

**OS, browser, IDE:** Windows 10, Microsoft Edge, VisualStudio code 

**Sample:** [BlazorUnionTypesJsInteropValidation](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation)

**Result:** 37 validation scenarios passed.

---

## Checks

Based on issue #68481 requirements - test each union type in both directions through JavaScript interop.

### Validation Scenarios

| No. | Scenario | Result | Evidence |
|------|----------|--------|----------|
| **01** | `NullableUnion(int?, string)` — Null active case preserved across interop (`null` round-trip) | Pass | [Null active case](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Core-Unions/01-NullableUnion-Null-Legacy-Unlabeled.png) |
| **02** | `UnambiguousUnion(int, string)` — Primitive round-trip for `int` (JS→C# and C#→JS) | Pass | [Integer round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Core-Unions/02-UnambiguousUnion-Int-RoundTrip-Legacy-Unlabeled.png) |
| **03** | `UnambiguousUnion(int, string)` — Primitive round-trip for `string` (JS→C# and C#→JS) | Pass | [String round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Core-Unions/03-UnambiguousUnion-String-RoundTrip-Legacy-Unlabeled.png) |
| **04** | `NestedUnion(UserData, ErrorData)` inside `Container.Payload` — nested value `null` preserved | Pass | [Nested null payload](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Core-Unions/04-NestedUnion-Null-Payload-Legacy-Unlabeled.png) |
| **05** | `NestedUnion(UserData, ErrorData)` inside `Container.Payload` — nested `UserData` preserved | Pass | [Nested user payload](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Core-Unions/05-NestedUnion-UserData-Payload-Legacy-Unlabeled.png) |
| **06** | `NestedUnion(UserData, ErrorData)` inside `Container.Payload` — nested `ErrorData` preserved | Pass | [Nested error payload](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Core-Unions/06-NestedUnion-ErrorData-Payload-Legacy-Unlabeled.png) |
| **07** | JavaScript → .NET: classifier selects `ApiResponse`; missing `[JsonRequired]` members produce a serializer error | Pass | [FailureResponse required members](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Error-Handling/07-ApiResponse-MissingRequired-FailureResponse-Server-Debug.png), [SuccessResponse required members](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Error-Handling/07-ApiResponse-MissingRequired-SuccessResponse-Server-Debug.png) |
| **08** | JavaScript → .NET: classifier selects `ApiResponse`; an invalid selected-case property type produces a serializer error | Pass | [FailureResponse invalid type](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Error-Handling/08-ApiResponse-InvalidType-FailureResponse-Server-Debug.png), [SuccessResponse invalid type](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Error-Handling/08-ApiResponse-InvalidType-SuccessResponse-Server-Debug.png) |
| **09** | Ambiguous record-shaped payload without a classifier — must surface explicit ambiguity error | Pass | [Property-based ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Ambiguity/09-PropertyBased-Ambiguity-Legacy-Unlabeled.png) |
| **10** | Completely unknown object shape reaches the `ApiResponse` classifier no-match path | Pass | [ApiResponse no match](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Error-Handling/10-ApiResponse-NoMatch-Server-Debug.png) |
| **11** | Multiple union cases match (no classifier) — named ambiguity error observed | Pass | [SimpleResult multiple matches](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Ambiguity/11-SimpleResult-MultipleMatches-Legacy-Unlabeled.png) |
| **12** | Multiple record shapes match during deserialization demonstrating ambiguity | Pass | [Property-based ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Ambiguity/09-PropertyBased-Ambiguity-Legacy-Unlabeled.png) |
| **13** | First record type (no classifier) — property-based discrimination demonstrates ambiguous matching | Pass | [Property-based ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Ambiguity/09-PropertyBased-Ambiguity-Legacy-Unlabeled.png) |
| **14** | Second record type (no classifier) — property-based discrimination demonstrates ambiguous matching | Pass | [Property-based ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Ambiguity/09-PropertyBased-Ambiguity-Legacy-Unlabeled.png) |
| **15** | Classifier-backed record union (`[JsonUnion(TypeClassifier=...)]`) — first classifier-resolved case | Pass | [Classifier resolution](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/15-TaggedResult-ClassifierResolution-Legacy-Unlabeled.png) |
| **16** | Classifier-backed `TaggedResult` — JavaScript sends `$type: "TaggedError"` and resolves the second case | Pass | [TaggedError resolved](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/16-TaggedResult-TaggedError-Server-Debug.png) |
| **17** | Classifier-backed record union — Round-trip when JavaScript supplies `$type` discriminator | Pass | [`$type` classifier round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/17-TaggedResult-WithType-Legacy-Unlabeled.png) |
| **18** | C# → JS: integer union case sent as raw JSON number (no wrapper object) | Pass | [Integer case](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/DotNetToJavaScript/18-Integer-NoWrapper-Legacy-Unlabeled.png) |
| **19** | C# → JS: string union case sent as raw JSON string (no wrapper object) | Pass | [String case](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/DotNetToJavaScript/19-String-NoWrapper-Legacy-Unlabeled.png) |
| **20** | ApiResponse `SuccessResponse` transmitted as case properties (no wrapper object) | Pass | [Success response](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/ApiResponse/20-SuccessResponse-NoWrapper-Legacy-Unlabeled.png) |
| **21** | ApiResponse `FailureResponse` transmitted as case properties (no wrapper object) | Pass | [Failure response](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/ApiResponse/21-FailureResponse-NoWrapper-Legacy-Unlabeled.png) |
| **22** | ApiResponse `RedirectResponse` transmitted as case properties (no wrapper object) | Pass | [Redirect response](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/ApiResponse/22-RedirectResponse-NoWrapper-Legacy-Unlabeled.png) |
| **23** | `ApiResponse` multi-case record behavior — C#→JS sends case properties without wrapper; JS→C# round-trip into correct active case | Pass | [Multi-case round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/ApiResponse/23-ApiResponse-MultiCase-RoundTrip-Legacy-Unlabeled.png) |
| **24** | JS → .NET: `NullableUnion` null active case preserved on deserialization | Pass | [Null round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/NullableUnion-RoundTrip/24-NullableUnion-Null-RoundTrip-Legacy-Unlabeled.png) |
| **25** | JS invokes .NET: `TaggedResult` resolves known discriminators and rejects an unknown value | Pass | [TaggedSuccess](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/15-TaggedResult-ClassifierResolution-Legacy-Unlabeled.png), [TaggedError](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/16-TaggedResult-TaggedError-Server-Debug.png), [unknown rejected](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/25-TaggedResult-UnknownType-Rejected-Server-Debug.png) |
| **26** | JS invokes .NET: `PropertyBased` union throws expected ambiguity error when cases overlap | Pass | [PropertyBased ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Ambiguity/26-PropertyBased-JSToDotNet-Ambiguity-Legacy-Unlabeled.png) |
| **27** | JS invokes .NET: `TypeBased` resolves exact `TBSuccess` and `TBError`, and rejects unknown or missing `$type` | Pass | [TBSuccess](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TypeBased/27-TypeBased-TBSuccess-Legacy-Unlabeled.png), [TBError](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TypeBased/27-TypeBased-TBError-Server-Debug.png), [unknown rejected](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TypeBased/27-TypeBased-UnknownType-Rejected-Server-Debug.png), [missing rejected](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TypeBased/27-TypeBased-MissingType-Rejected-Server-Debug.png) |
| **28** | JS invokes .NET: `PaymentResult` deserializes `PaymentApproved` from a complex record payload | Pass | [Complex union](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Other-Interop/28-PaymentResult-Complex-Legacy-Unlabeled.png) |
| **29** | JS invokes .NET: generic `Result<string>` deserializes `Ok<string>` payload correctly | Pass | [Generic string result](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Other-Interop/29-GenericResult-String-Legacy-Unlabeled.png) |
| **30** | JS invokes .NET: generic `Result<int>` deserializes `Ok<int>` payload correctly | Pass | [Generic integer result](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Other-Interop/30-GenericResult-Int-Legacy-Unlabeled.png) |
| **31** | JS invokes .NET: `IntResult` deserializes `IntSuccess` value-type payload correctly | Pass | [IntResult](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Other-Interop/31-IntResult-ValueType-Legacy-Unlabeled.png) |
| **32** | JS invokes .NET: `StringResult` deserializes `StringSuccess` reference-type payload correctly | Pass | [StringResult](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Other-Interop/32-StringResult-ReferenceType-Legacy-Unlabeled.png) |
| **33** | JS → C#: union-level `[JsonUnion(TypeClassifier=...)]` resolves same-shape record deserialization correctly | Pass | [Classifier resolution](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/15-TaggedResult-ClassifierResolution-Legacy-Unlabeled.png) |
| **34** | C# → JS: Preview behavior — `$type` discriminator is not emitted; only active-case JSON crosses the boundary | Pass | [No emitted wrapper](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/17-TaggedResult-WithType-Legacy-Unlabeled.png) |
| **35** | JS → C#: JavaScript may add `$type` to aid classifier-based deserialization on the .NET side | Pass | [`$type` classifier](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/TaggedResult/17-TaggedResult-WithType-Legacy-Unlabeled.png) |
| **36** | JS → .NET: `PropertyBased(PBSuccess, PBError)` without a classifier produces ambiguity error | Pass | [PropertyBased ambiguity](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/Ambiguity/26-PropertyBased-JSToDotNet-Ambiguity-Legacy-Unlabeled.png) |
| **37** | JS invokes .NET and receives a union return value — JS→C#→JS round-trip for a union parameter and return | Pass | [Multi-case round-trip](https://github.com/vendasankarsf3945/BlazorUnionTypesJsInteropValidation/blob/main/Evidence/Screenshots/ApiResponse/23-ApiResponse-MultiCase-RoundTrip-Legacy-Unlabeled.png) |

## Test Coverage and Required Builds

The source contains equivalent scenarios for all three deployment models:

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