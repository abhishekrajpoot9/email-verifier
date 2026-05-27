const {validSyntax}=require("../src/validator");
const {getDidYouMean}=require("../src/typoDetection");
describe("Syntax Validation", () => {

    test("Valid email passes", () => {
        expect(validSyntax("test@gmail.com")).toBe(true);
    });

    test("Missing @ rejected", () => {
        expect(validSyntax("testgmail.com")).toBe(false);
    });

    test("Double dots rejected", () => {
        expect(validSyntax("ab..cd@gmail.com")).toBe(false);
    });

    test("Multiple @ rejected", () => {
        expect(validSyntax("a@@gmail.com")).toBe(false);
    });

    test("Empty string rejected", () => {
        expect(validSyntax("")).toBe(false);
    });

    test("Null rejected", () => {
        expect(validSyntax(null)).toBe(false);
    });

    test("Undefined rejected", () => {
        expect(validSyntax(undefined)).toBe(false);
    });
    test("Email without domain rejected", () => {
        expect(
            validSyntax("test@")
        ).toBe(false);
    });
    
    test("Email without username rejected", () => {
        expect(
            validSyntax("@gmail.com")
        ).toBe(false);
    });
    
    test("Email with spaces rejected", () => {
        expect(
            validSyntax("test @gmail.com")
        ).toBe(false);
    });
    
    test("Email with invalid extension rejected", () => {
        expect(
            validSyntax("test@gmail")
        ).toBe(false);
    });
    test("Very long email", () => {
        const longEmail =
            "a".repeat(100) + "@gmail.com";

        expect(validSyntax(longEmail)).toBe(true);
    });

});
describe("Typo Detection",() => {

    test("gmial typo corrected", () => {
        expect(
              getDidYouMean("user@gmial.com")
        ).toBe("user@gmail.com");
    });

    test("yahooo typo corrected",() => {
        expect(
            getDidYouMean("user@yahooo.com")
        ).toBe("user@yahoo.com");
    });
    test("hotmial typo corrected", () => {
        expect(
            getDidYouMean("user@hotmial.com")
        ).toBe("user@hotmail.com");
    });
    
    test("outlok typo corrected", () => {
        expect(
            getDidYouMean("user@outlok.com")
        ).toBe("user@outlook.com");
    });

    test("No typo returns null", () => {
        expect(
   getDidYouMean("user@gmail.com")
        ).toBe(null);
    });

});
