const Binder = (obj, methods) => {
    for (let i = 0; i < methods.length; i++) {
        obj[methods[i]] = obj[methods[i]].bind(obj);
    }
};

export { Binder };