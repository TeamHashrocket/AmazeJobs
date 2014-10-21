module.exports = {
	// a succinct way to handle errors
	// makes it easy to debug
    handleError: function(res, code, err) {
        console.error(err);
        res.status(code).json({ error: err });
    }
}