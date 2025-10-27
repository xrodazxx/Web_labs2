function errorMiddleware(err, req, res) {
    console.error(err);
    if (err.statusCode) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}
export default errorMiddleware;
