function generateNumberedPatterns(totalBooks) {
    const patterns = [];
    for (let i = 1; i <= totalBooks; i++) {
        // Format the number as a 3-digit string
        const formattedNumber = i.toString().padStart(6, 'S.T.00');
        patterns.push(formattedNumber);
    }
    return patterns;
}

// Example usage:
const totalBooks = 15; // Replace with the actual number of books in the collection
const numberedPatterns = generateNumberedPatterns(totalBooks);
console.log(numberedPatterns); // Outputs: ['001', '002', '003', ..., '125']