module.exports = {
    handleError: function(res, code, err) {
        console.error(err);
        res.status(code).send(err);
    }
}