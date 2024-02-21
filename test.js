// const splitter = (number, earning, joining, checker) => {
//   const remainingEarningSpace = 30 - earning;
//   const remainingJoiningSpace = 60 - joining;

//   // Add to earning first
//   if (remainingEarningSpace > 0 && number > 0 && checker === false) {
//     const earningToAdd = Math.min(remainingEarningSpace, number);
//     earning += earningToAdd;
//     number -= earningToAdd;

//     if (earning >= 30) {
//       checker = true;
//     }
//   }

//   // Add to joining
//   if (remainingJoiningSpace > 0 && number > 0 && checker === true) {
//     const joiningToAdd = Math.min(remainingJoiningSpace, number);
//     joining += joiningToAdd;
//     number -= joiningToAdd;

//     if (joining >= 60) {
//       checker = false;
//     }
//   }

//   // Add remaining to earning
//   if (number > 0) {
//     earning += number;
//   }

//   console.log(`Earning is ${earning} and joining is ${joining}`);
//   return { earning, joining };
// };

// splitter(4, 30, 59, true);

// const value = { number: 10 };

// const multiply = (x = { ...value }) => {
//   console.log((x.number *= 2));
// };

// multiply();
// multiply();
// multiply(value);
// multiply(value);