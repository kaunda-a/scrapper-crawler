import brain from 'brain.js';

const net = new brain.NeuralNetwork();

// Example training data - in a real-world scenario, this should be replaced with actual user behavior data
const trainingData = [
  { input: { timeSpent: 0.1, scrollDepth: 0.1 }, output: { action: 0 } }, // 0 for click
  { input: { timeSpent: 0.2, scrollDepth: 0.3 }, output: { action: 1 } }, // 1 for scroll
  { input: { timeSpent: 0.3, scrollDepth: 0.5 }, output: { action: 2 } }, // 2 for wait
];

net.train(trainingData);

export const predictAction = (timeSpent: number, scrollDepth: number) => {
  const result = net.run({ timeSpent, scrollDepth });
  const action = Math.round(result.action); // Convert to integer action
  return action;
};
