using System.Text.Json.Serialization;

namespace UnionInteropValidationWasm_Client.Models;

// 1. UNAMBIGUOUS UNION - Different primitive types distinguish cases
public record class UnambiguousInt(int Value);
public record class UnambiguousString(string Value);
public union UnambiguousUnion(UnambiguousInt, UnambiguousString);

// 2. NULLABLE ACTIVE CASE - Union with nullable properties
public record class WithValue(string Message, int? Value);
public record class EmptyCase;
public union NullableUnion(WithValue, EmptyCase);

// 3. NESTED UNION - Union inside container object
public class Container
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("payload")]
    public NestedUnion? Payload { get; set; }
}

public record class UserData(string Name, string Email);
public record class ErrorData(string Code, string Message);
public union NestedUnion(UserData, ErrorData);

// 4. AMBIGUOUS SHAPES - Same structure, different meaning
// WITHOUT type classifier (ambiguous - cannot distinguish)
public record class SimpleSuccess(string Value);
public record class SimpleError(string Value);
public union SimpleResult(SimpleSuccess, SimpleError);

// WITH type classifier (clarified - explicit $type field)
[JsonUnion]
public record class TaggedSuccess(string Value);

[JsonUnion]
public record class TaggedError(string Value);

public union TaggedResult(TaggedSuccess, TaggedError);

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
public union ApiResponse(SuccessResponse, FailureResponse, RedirectResponse);

// 8. COMPLEX PROPERTIES - Multiple properties with different types
public record class PaymentApproved(string TransactionId, decimal Amount, DateTime ApprovedAt);
public record class PaymentDeclined(string Reason, int ErrorCode);
public record class PaymentPending(string ReferenceId, DateTime? EstimatedTime);
public union PaymentResult(PaymentApproved, PaymentDeclined, PaymentPending);

// 9. VALUE TYPES - Union with value type (int)
public record class IntSuccess(int Value);
public record class IntError(string Message);
public union IntResult(IntSuccess, IntError);

// 10. REFERENCE TYPES - Union with reference type (string)
public record class StringSuccess(string Content, string Metadata);
public record class StringEmpty;
public union StringResult(StringSuccess, StringEmpty);

// 11. PROPERTY-BASED DISCRIMINATION - Unique properties distinguish cases
public record class PBSuccess(string Result);
public record class PBError(string Result);
public union PropertyBased(PBSuccess, PBError);

// 12. TYPE-BASED DISCRIMINATION - Explicit $type field
[JsonUnion]
public record class TBSuccess(string Result);

[JsonUnion]
public record class TBError(string Result);
public union TypeBased(TBSuccess, TBError);
