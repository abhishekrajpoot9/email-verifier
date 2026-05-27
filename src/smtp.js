const dns=require("dns").promises;
const net=require("net");
async function checkSMTP(email,domain){
    try{
const mxRecords=dns.mxResolve(domain);
if(!mxRecords||mxRecords.length===0){
    return{
result:"invalid",
subresult: "no_mx_records",
 mxRecords: []
    }
}
mxRecords.sort((a,b)=>a.priority-b.priority)
const mxHost=mxRecords[0].exchange;
return new Promise((resolve)=>{
const socket=net.createConnection(25,mxHost);
socket.setTimeout(10000);

socket.on("connect", () => {
    socket.write("HELO example.com\r\n");
    socket.write("MAIL FROM:<test@example.com>\r\n");
    socket.write(`RCPT TO:<${email}>\r\n`);
});
socket.on("data", (data) => {
    const response = data.toString();
    if (response.includes("250")) {
        resolve({
            result: "valid",
            subresult: "mailbox_exists",
            mxRecords: mxRecords.map(mx => mx.exchange)
        });
    }
    else if (response.includes("550")) {
        resolve({
            result: "invalid",
            subresult: "mailbox_does_not_exist",
            mxRecords: mxRecords.map(mx => mx.exchange)
        });
    }

    else if (response.includes("450")) {
        resolve({
            result: "unknown",
            subresult: "greylisted",
            mxRecords: mxRecords.map(mx => mx.exchange)
        });
    }

    socket.end();
});
socket.on("timeout", () => {
    resolve({
        result: "unknown",
        subresult: "connection_timeout",
        mxRecords: mxRecords.map(mx => mx.exchange)
    });

    socket.destroy();
});
socket.on("error", (err) => {
    resolve({
        result: "unknown",
        subresult: "connection_error",
        error: err.message,
        mxRecords: mxRecords.map(mx => mx.exchange)
    });
});
 });
 }catch (err) {
    return {
        result: "invalid",
        subresult: "dns_error",
        error: err.message,
        mxRecords: []
    };
}
}