// Centralized error handler

export function handleError(error, context = '?') {
  const message =
    error?.response?.data?.error?.message ||
    error?.message ||
    'Something went wrong';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error Handler[${context}]`, error);
  }

  return message;
}
