/**
 * Payment Result - Test complex properties (decimal, DateTime, nullable)
 * Demonstrates proper serialization of complex types in union cases
 */

export function processPayment(payment) {
    console.log("JS received payment result:", payment);
    
    if (payment.transactionId !== undefined) {
        return {
            type: "PaymentApproved",
            transactionId: payment.transactionId,
            amount: payment.amount,
            approvedAt: payment.approvedAt,
            display: `Approved: ${payment.transactionId} - $${payment.amount}`,
            note: `Amount is decimal: ${payment.amount}. Timestamp: ${payment.approvedAt}`
        };
    } else if (payment.reason !== undefined) {
        return {
            type: "PaymentDeclined",
            reason: payment.reason,
            errorCode: payment.errorCode,
            display: `Declined: ${payment.reason} (${payment.errorCode})`
        };
    } else if (payment.referenceId !== undefined) {
        return {
            type: "PaymentPending",
            referenceId: payment.referenceId,
            estimatedTime: payment.estimatedTime,
            display: `Pending: ${payment.referenceId}`,
            note: `Estimated time is ${payment.estimatedTime ? payment.estimatedTime : "not provided (null)"}`
        };
    }
    
    return { error: "Unknown payment result type" };
}

export async function callCSharpWithPayment() {
    console.log("JS calling C# method with PaymentResult");
    try {
        const result = await DotNet.invokeMethodAsync("UnionInteropValidation.Standalone", "HandlePaymentFromJS", { 
            transactionId: "TXN-JS-001",
            amount: 99.99,
            approvedAt: new Date().toISOString()
        });
        console.log("C# response:", result);
        return result;
    } catch (error) {
        console.error("Error calling C# method:", error);
        return { error: error.message };
    }
}

