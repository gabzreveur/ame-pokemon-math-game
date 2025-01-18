export function generateAddition() {
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    let result= num1+num2;
    return {num1, num2, result };
}