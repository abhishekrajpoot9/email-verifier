const Domains=[  "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com"]
    function levenshtein(a, b) {
        const matrix = [];
    
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
    
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
    
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
    
        return matrix[b.length][a.length];
    }
    
    function getDidYouMean(email) {
        const [name, domain] = email.split("@");
    
        for (const correctDomain of Domains) {
            const distance = levenshtein(domain, correctDomain);
    
            if (distance <= 2 && domain !== correctDomain) {
                return `${name}@${correctDomain}`;
            }
        }
    
        return null;
    }
    
    module.exports = { getDidYouMean};