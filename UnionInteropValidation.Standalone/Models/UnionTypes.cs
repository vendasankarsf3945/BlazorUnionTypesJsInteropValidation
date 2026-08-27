using System.Text.Json;
using System.Text.Json.Serialization;

namespace UnionInteropValidation.Standalone.Models;

// 1. UNAMBIGUOUS UNION - int and string are self-discriminating by JSON type
public union UnambiguousUnion(int, string);

// 2. NULLABLE UNION - int? active case can be null; tests null-active-case scenario
public union NullableUnion(int?, string);

// 3. NESTED UNION - Union inside container object
public class Container
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("payload")]
    public NestedUnion? Payload { get; set; }
}

// Wraps NullableUnion(int?,string) — demonstrates null/int/string values nested inside an object
public class NullableContainer
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("value")]
    public NullableUnion? Value { get; set; }
}

public record class UserData(string Name, string Email);
public record class ErrorData(string Code, string Message);

[JsonUnion(TypeClassifier = typeof(NestedUnionClassifierFactory))]
public union NestedUnion(UserData, ErrorData);

public sealed class NestedUnionClassifierFactory : JsonTypeClassifierFactory<NestedUnion>
{
    public override JsonTypeClassifier CreateJsonClassifier(JsonTypeClassifierContext context, JsonSerializerOptions options) =>
        static (ref Utf8JsonReader reader) =>
        {
            var scan = reader;
            while (scan.Read() && scan.TokenType != JsonTokenType.EndObject)
            {
                if (scan.TokenType == JsonTokenType.PropertyName)
                {
                    var n = scan.GetString();
                    if (string.Equals(n, "name", StringComparison.OrdinalIgnoreCase)) return typeof(UserData);
                    if (string.Equals(n, "code", StringComparison.OrdinalIgnoreCase)) return typeof(ErrorData);
                }
                else if (scan.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                    scan.Skip();
            }
            return typeof(UserData);
        };
}

// 4. AMBIGUOUS SHAPES - Same structure, different meaning
// WITHOUT type classifier (ambiguous - cannot distinguish)
public record class SimpleSuccess(string Value);
public record class SimpleError(string Value);
public union SimpleResult(SimpleSuccess, SimpleError);

// Classifier always picks TaggedSuccess; both cases have the same JSON shape
public record class TaggedSuccess(string Value);
public record class TaggedError(string Value);

[JsonUnion(TypeClassifier = typeof(TaggedResultClassifierFactory))]
public union TaggedResult(TaggedSuccess, TaggedError);

public sealed class TaggedResultClassifierFactory : JsonTypeClassifierFactory<TaggedResult>
{
    public override JsonTypeClassifier CreateJsonClassifier(JsonTypeClassifierContext context, JsonSerializerOptions options) =>
        static (ref Utf8JsonReader reader) =>
        {
            var scan = reader;
            while (scan.Read() && scan.TokenType != JsonTokenType.EndObject)
            {
                if (scan.TokenType == JsonTokenType.PropertyName)
                {
                    var prop = scan.GetString();
                    if (string.Equals(prop, "$type", StringComparison.OrdinalIgnoreCase))
                    {
                        scan.Read();
                        var t = scan.GetString();
                        if (t != null && t.Contains("Error", StringComparison.OrdinalIgnoreCase))
                            return typeof(TaggedError);
                        return typeof(TaggedSuccess);
                    }
                    else scan.Skip();
                }
                else if (scan.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                    scan.Skip();
            }
            return typeof(TaggedSuccess);
        };
}

// 5. BASIC INTEROP - Simple success/error/not-found
public record class SuccessResult(string Message, object? Data);
public record class ErrorResult(string ErrorCode, string ErrorMessage);
public record class NotFoundResult;
public union UnionResult(SuccessResult, ErrorResult, NotFoundResult);

// 6. GENERIC UNION - T-shaped pattern
public record class Ok<T>(T Value);
public record class Error<T>(string Message);
public union Result<T>(Ok<T>, Error<T>);

// 7. MULTI-CASE UNION - Complex real-world scenario
public record class SuccessResponse(int StatusCode, string Data, DateTime Timestamp);
public record class FailureResponse(int StatusCode, string ErrorMessage, string ErrorCode);
public record class RedirectResponse(string Url, int RedirectCode);

[JsonUnion(TypeClassifier = typeof(ApiResponseClassifierFactory))]
public union ApiResponse(SuccessResponse, FailureResponse, RedirectResponse);

public sealed class ApiResponseClassifierFactory : JsonTypeClassifierFactory<ApiResponse>
{
    public override JsonTypeClassifier CreateJsonClassifier(JsonTypeClassifierContext context, JsonSerializerOptions options) =>
        static (ref Utf8JsonReader reader) =>
        {
            var scan = reader;
            while (scan.Read() && scan.TokenType != JsonTokenType.EndObject)
            {
                if (scan.TokenType == JsonTokenType.PropertyName)
                {
                    var name = scan.GetString();
                    if (string.Equals(name, "url", StringComparison.OrdinalIgnoreCase)) return typeof(RedirectResponse);
                    if (string.Equals(name, "errorMessage", StringComparison.OrdinalIgnoreCase)) return typeof(FailureResponse);
                    if (string.Equals(name, "data", StringComparison.OrdinalIgnoreCase)) return typeof(SuccessResponse);
                }
                else if (scan.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                    scan.Skip();
            }
            return typeof(SuccessResponse);
        };
}

// 8. COMPLEX PROPERTIES - Multiple properties with different types
public record class PaymentApproved(string TransactionId, decimal Amount, DateTime ApprovedAt);
public record class PaymentDeclined(string Reason, int ErrorCode);
public record class PaymentPending(string ReferenceId, DateTime? EstimatedTime);

[JsonUnion(TypeClassifier = typeof(PaymentResultClassifierFactory))]
public union PaymentResult(PaymentApproved, PaymentDeclined, PaymentPending);

public sealed class PaymentResultClassifierFactory : JsonTypeClassifierFactory<PaymentResult>
{
    public override JsonTypeClassifier CreateJsonClassifier(JsonTypeClassifierContext context, JsonSerializerOptions options) =>
        static (ref Utf8JsonReader reader) =>
        {
            var scan = reader;
            while (scan.Read() && scan.TokenType != JsonTokenType.EndObject)
            {
                if (scan.TokenType == JsonTokenType.PropertyName)
                {
                    var name = scan.GetString();
                    if (string.Equals(name, "transactionId", StringComparison.OrdinalIgnoreCase)) return typeof(PaymentApproved);
                    if (string.Equals(name, "reason", StringComparison.OrdinalIgnoreCase)) return typeof(PaymentDeclined);
                    if (string.Equals(name, "referenceId", StringComparison.OrdinalIgnoreCase)) return typeof(PaymentPending);
                }
                else if (scan.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                    scan.Skip();
            }
            return typeof(PaymentApproved);
        };
}

// 9. VALUE TYPES - Union with value type (int)
public record class IntSuccess(int Value);
public record class IntError(string Message);

[JsonUnion(TypeClassifier = typeof(IntResultClassifierFactory))]
public union IntResult(IntSuccess, IntError);

public sealed class IntResultClassifierFactory : JsonTypeClassifierFactory<IntResult>
{
    public override JsonTypeClassifier CreateJsonClassifier(JsonTypeClassifierContext context, JsonSerializerOptions options) =>
        static (ref Utf8JsonReader reader) =>
        {
            var scan = reader;
            while (scan.Read() && scan.TokenType != JsonTokenType.EndObject)
            {
                if (scan.TokenType == JsonTokenType.PropertyName)
                {
                    var name = scan.GetString();
                    if (string.Equals(name, "value", StringComparison.OrdinalIgnoreCase)) return typeof(IntSuccess);
                    if (string.Equals(name, "message", StringComparison.OrdinalIgnoreCase)) return typeof(IntError);
                }
            }
            return typeof(IntSuccess);
        };
}

// 10. REFERENCE TYPES - Union with reference type (string)
public record class StringSuccess(string Content, string Metadata);
public record class StringEmpty;

[JsonUnion(TypeClassifier = typeof(StringResultClassifierFactory))]
public union StringResult(StringSuccess, StringEmpty);

public sealed class StringResultClassifierFactory : JsonTypeClassifierFactory<StringResult>
{
    public override JsonTypeClassifier CreateJsonClassifier(JsonTypeClassifierContext context, JsonSerializerOptions options) =>
        static (ref Utf8JsonReader reader) =>
        {
            var scan = reader;
            while (scan.Read() && scan.TokenType != JsonTokenType.EndObject)
            {
                if (scan.TokenType == JsonTokenType.PropertyName)
                {
                    var name = scan.GetString();
                    if (string.Equals(name, "content", StringComparison.OrdinalIgnoreCase)) return typeof(StringSuccess);
                }
            }
            return typeof(StringEmpty);
        };
}

// 11. PROPERTY-BASED DISCRIMINATION - Unique properties distinguish cases
public record class PBSuccess(string Result);
public record class PBError(string Result);
public union PropertyBased(PBSuccess, PBError);

// 12. TYPE-BASED DISCRIMINATION - Explicit $type field
public record class TBSuccess(string Result);
public record class TBError(string Result);

[JsonUnion(TypeClassifier = typeof(TypeBasedClassifierFactory))]
public union TypeBased(TBSuccess, TBError);

public sealed class TypeBasedClassifierFactory : JsonTypeClassifierFactory<TypeBased>
{
    public override JsonTypeClassifier CreateJsonClassifier(JsonTypeClassifierContext context, JsonSerializerOptions options) =>
        static (ref Utf8JsonReader reader) =>
        {
            var scan = reader;
            while (scan.Read() && scan.TokenType != JsonTokenType.EndObject)
            {
                if (scan.TokenType == JsonTokenType.PropertyName)
                {
                    var prop = scan.GetString();
                    if (string.Equals(prop, "$type", StringComparison.OrdinalIgnoreCase))
                    {
                        scan.Read();
                        var t = scan.GetString();
                        if (t != null && t.Contains("Error", StringComparison.OrdinalIgnoreCase))
                            return typeof(TBError);
                        return typeof(TBSuccess);
                    }
                    else scan.Skip();
                }
                else if (scan.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                    scan.Skip();
            }
            return typeof(TBSuccess);
        };
}
