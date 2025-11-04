export function notFound(req, res, _next) {
    res
      .status(404)
      .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  }
  
  export function errorHandler(err, _req, res, _next) {
    const code = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(code).json({
      message: err?.message || "Server error",
      stack: process.env.NODE_ENV === "production" ? undefined : err?.stack,
    });
  }
  