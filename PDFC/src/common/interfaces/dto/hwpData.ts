export interface HWPDataJson {
    string: StrObject[],
    table: TableObject[],
    image: ImgObject[]
}

interface StrObject {
    key: string,
    value: string
}

interface TableObject {
    key: string,
    value: TableCell[]
}

interface TableCell {
    row: number,
    col: number,
    value: string
}

interface ImgObject {
    key: string,
    url: string
}

// interface MetaObject {
//     filepath: string,
//     template: string
// }