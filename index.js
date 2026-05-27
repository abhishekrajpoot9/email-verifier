const { verifyEmail } = require("./src/emailVerifier");

(async () => {

    const result =
        await verifyEmail("test@gmial.com");

    console.log(result);

})();