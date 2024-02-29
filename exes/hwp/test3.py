from pydantic import BaseModel

class TableCell(BaseModel):
    col: str
    row: str
    value: str

class TableObject(BaseModel):
    key: str
    value: list[TableCell]

table_json = {
    "key": "my_table",
    "value": [
        {
            "col": "0",
            "row": "0",
            "value": "value00"
        },
        {
            "col": "1",
            "row": "0",
            "value": "value10"
        },
        {
            "col": "2",
            "row": "0",
            "value": "value10"
        },
        {
            "col": "0",
            "row": "1",
            "value": "value10"
        },
        {
            "col": "1",
            "row": "1",
            "value": "value11"
        },
        {
            "col": "2",
            "row": "1",
            "value": "value11"
        },
    ]
}
table = TableObject(**table_json)

for i in range(0, len(table.value)-1):
    table.value[i]
    table.value[i+1]