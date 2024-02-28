import os, json
from dto.input_order_dto import InputOrderDto
from hwp.hwp_gen import HwpGenerator
from utils.filesystem import FileSystem

fs = FileSystem('file', 'data.json')
jsonfile = fs.read()
pydanticObject = InputOrderDto(**jsonfile)

print(pydanticObject)

result = HwpGenerator(pydanticObject).run()

fs2 = FileSystem('result', 'test.json')
fs2.write_pydantic(result)

