class Product{
    constructor(pid, code, title, thumbnail, description, price, stock){
        this.pid = pid;
        this.code = code;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.description = description;
        this.stock = stock
    };
};

module.exports = Product