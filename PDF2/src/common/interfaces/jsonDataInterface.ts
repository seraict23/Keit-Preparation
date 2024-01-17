import { TaskType } from "../constant/types"

interface JsonDataInterface {
    file: string
    createdBy: string
    createdAt: string
    type: TaskType
    status: string
    content: JsonDataContentInterface
}

interface JsonDataContentInterface {
    text: Array<JsonDataContentTextInterface>
    table: Array<JsonDataContentTableInterface>
}

interface JsonDataContentTextInterface {
    number: number
    value: string
}

interface JsonDataContentTableInterface {
    number: number
    cell: Array<JsonDataContentTableCellInterface>
}

interface JsonDataContentTableCellInterface {
    row: number
    column: number
    value: string
}

export {JsonDataInterface, JsonDataContentInterface}