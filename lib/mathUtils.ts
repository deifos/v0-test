export const generateWrongAnswers = (correctAnswer: number) => {
    const wrong1 = correctAnswer + Math.floor(Math.random() * 5) + 1;
    let wrong2 = correctAnswer - Math.floor(Math.random() * 5) - 1;
    if (wrong2 < 0) wrong2 = correctAnswer + Math.floor(Math.random() * 5) + 2;
    return [wrong1, wrong2];
  };


  export const generateQuestion = (includeSubtraction = false) => {
    const operation = includeSubtraction && Math.random() < 0.5 ? "-" : "+";
    let num1, num2;
    if (operation === "+") {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
    } else {
      num1 = Math.floor(Math.random() * 10) + 5;
      num2 = Math.floor(Math.random() * num1);
    }
    const question = `${num1} ${operation} ${num2}`;
    const answer = operation === "+" ? num1 + num2 : num1 - num2;
    return { question, answer };
  };
  