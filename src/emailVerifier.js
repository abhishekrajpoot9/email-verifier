const{validSyntax}=require("./validator.js");
const {getDidYouMean}=require("./typoDetection.js")
const {checkSMTP}=require("./smtp.js");
async function verifyEmail(email){
    const startTime = Date.now();
    if(!validSyntax(email)){
        return {
            email,
            result: "invalid",
            resultcode: 6,
            subresult: "invalid_syntax",
            executiontime: 0,
            timestamp: new Date().toISOString()
        };
    }
    const typoSuggestion = getDidYouMean(email);
    if (typoSuggestion) {
        return {
            email,
            result: "invalid",
            resultcode: 6,
            subresult: "typo_detected",
            didyoumean: typoSuggestion,
            executiontime: 0,
            timestamp: new Date().toISOString()
        };
    }
    const domain = email.split("@")[1];
    const smtpResult = await checkSMTP(email, domain);

    const endTime = Date.now();
    return {
        email,
        domain,
        result: smtpResult.result,
        resultcode:
            smtpResult.result === "valid"
                ? 1
                : smtpResult.result === "unknown"
                ? 3
                : 6,

        subresult: smtpResult.subresult,

        mxRecords: smtpResult.mxRecords,

        executiontime: ((endTime - startTime) / 1000).toFixed(2),

        error: smtpResult.error || null,

        timestamp: new Date().toISOString()
    };

}
module.exports = { verifyEmail };