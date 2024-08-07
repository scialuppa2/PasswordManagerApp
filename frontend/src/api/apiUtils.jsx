export const handleApiError = (error) => {
  if (!error.response) {
    if (error.request) {
      return 'Network error: No response received. Please check your connection.';
    } else {
      return `Error in request setup: ${error.message}`;
    }
  }

  const { status, data } = error.response;
  const errorMessage = data?.errorMessage || error.message;

  switch (status) {
    case 400:
      return errorMessage || "Bad Request: The server could not understand the request.";
    case 401:
      if (errorMessage === 'Token expired. Please login again.') {
        return "Session expired. Please login again.";
      }
      if (errorMessage === 'Invalid token. Please login again.') {
        return "Invalid token. Please login again.";
      }
      return errorMessage || "Unauthorized: Please login to access this resource.";
    case 403:
      return errorMessage || "Forbidden: You don't have permission to access this resource.";
    case 404:
      return errorMessage || "Not Found: The requested resource could not be found.";
    case 500:
      return errorMessage || "Internal Server Error: Something went wrong on the server.";
    default:
      return `Unexpected error: ${status} ${errorMessage}`;
  }
};
