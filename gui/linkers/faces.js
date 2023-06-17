function get_blinks() {
    var python = require("python-shell")
    var path = require("path")

    var options = {
        scriptPath: path.join(__dirname, '/../engine.py'),
        pythonPath: '/usr/local/bin/python3'
    }

    var face = new python("faces.py",options)
    face.on('message', function(message) {
        
    })

    // })
}