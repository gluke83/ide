self.addEventListener('message', function(e) {
    try {
        eval(e.data);
        self.postMessage(''); // Send back an empty message on success
    } catch (error) {
        self.postMessage('Error: ' + error.message);
    }
});
