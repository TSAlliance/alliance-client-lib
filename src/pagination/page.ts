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
