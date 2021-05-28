export class Page<T> {
    public totalElements: number;
    public totalPages: number;
    public amount: number;
    public activePage: number;
    public activePageSize: number;
    public elements: Array<T>;

    constructor(totalElements: number, activePage: number, activePageSize: number, amount: number, elements: Array<T>) {
        this.totalElements = totalElements;
        this.totalPages = Math.ceil(totalElements / activePageSize);
        this.amount = amount;
        this.activePage = activePage;
        this.activePageSize = activePageSize;
        this.elements = elements;
    }
}

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
