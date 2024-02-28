from pydantic import BaseModel

class StrObject(BaseModel):
    key: str
    value: str

class TableCell(BaseModel):
    col: str
    row: str
    value: str

class TableObject(BaseModel):
    key: str
    value: list[TableCell]

class ImgObject(BaseModel):
    key: str
    url: str

class MetaObject(BaseModel):
    filename: str
    template: str

class InputOrderDto(BaseModel):
    meta: MetaObject
    string: list[StrObject]
    table: list[TableObject]
    image: list[ImgObject]

def dto_to_json():
    pass
