// src/services/queue.service.js

let queue = [];

// add user to queue
export const addToQueue = () => {
  const position = queue.length + 1;
  queue.push(position);
  return position;
};

// optional helpers (future use)
export const getQueue = () => queue;

export const clearQueue = () => {
  queue = [];
};
