interface FetchError extends Error {
  info?: any;
  status?: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (!res.ok) {
    const error: FetchError = new Error(
      "An error occurred while fetching the data."
    );
    try {
      error.info = await res.json();
    } catch (e) {
      error.info = "Failed to parse error response";
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default fetcher;
