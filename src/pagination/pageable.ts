export class Pageable {
    public size: number;
    public page: number;

    constructor(size: number, page: number) {
        this.size = size;
        this.page = page;
    }

    public static of(size: number, page: number) {
        return new Pageable(size, page);
    }
}
