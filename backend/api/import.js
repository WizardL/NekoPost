import FileSystem from 'fs'
import Path from 'path'

// Imports modules from a directory.
// First arg: dir path, 
// second arg: ignore it, it stores loaded modules only
function importDir(dir, mods) {
    let me = mods || {};

    FileSystem.readdirSync(dir).forEach(file => {
        // Mix the two folders together
        let path = Path.resolve(dir, file);

        // If the file is a directory, do some recursive
        if (FileSystem.statSync(path).isDirectory()) { 
            importDir(path, me)
            return
        }

        // Load the modules
        let module = require(path);
        
        // Some shenanigans
        let _module = (obj => 
            obj && obj.__esModule ? obj : { default: obj }
        )(module); 

        // Set the variable to the module
        // (also throws the file extension out of the var name)
        me[file.split('.')[0]] = _module.default
    })

    return me
}

export default importDir