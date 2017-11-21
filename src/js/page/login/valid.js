let salt = btoa('juniukeji');

let encode = (str, withSalt = false) => {
    var hash = md5.create();
    console.log(salt);
    hash.update(withSalt ? salt + str : str);
    return hash.hex();
}

export default {
    encode
}