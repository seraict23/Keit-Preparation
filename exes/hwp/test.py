import unittest
from dto import *
from utils import *
from hwp import *
import os

class TestInputOrderDto(unittest.TestCase):
    # def test_pydantic(self):
    #     inputJsonData = {
    #         'meta': {
    #             'filepath': '',
    #             'template': ''
    #         },
    #         'string': [
    #             {'key': 'string_no1', 'value': 'value_1'},
    #             {'key': 'string_no2', 'value': 'value_2'}
    #         ],
    #         'table': [
    #             {'key': 'table_no1',
    #             'value': [
    #                 {'col': 'col_1', 'row': 'row_2', 'value': 'value_1'},
    #                 {'col': 'col_2', 'row': 'row_2', 'value': 'value_2'}
    #             ]}
    #         ],
    #         'image': [
    #             {'key': 'img_no1', 'url': 'localhost'}
    #         ]
    #     }

    #     inputOrderDto = InputOrderDto(**inputJsonData)

    #     self.assertEqual(inputOrderDto.string[0].key, 'string_no1')


    # def test_fileread(self):
    #     path = os.path.join(os.getcwd(), 'file/data.json')

    #     fs = FileSystem(path)
    #     result = fs.read()

    #     self.assertEqual(result['string'][0]['key'], 'string_no1')


    # def test_json_write(self):
    #     inputJsonData = {
    #         'meta': {
    #             'filepath': '',
    #             'template': ''
    #         },
    #         'string': [
    #             {'key': 'string_no1', 'value': 'value_1'},
    #             {'key': 'string_no2', 'value': 'value_2'}
    #         ],
    #         'table': [
    #             {'key': 'table_no1',
    #             'value': [
    #                 {'col': 'col_1', 'row': 'row_2', 'value': 'value_1'},
    #                 {'col': 'col_2', 'row': 'row_2', 'value': 'value_2'}
    #             ]}
    #         ],
    #         'image': [
    #             {'key': 'img_no1', 'url': 'localhost'}
    #         ]
    #     }
    #     inputOrderDto = InputOrderDto(**inputJsonData)
    #     inputOrderJson = json.loads(inputOrderDto.model_dump_json())


    #     path = os.path.join(os.getcwd(), 'file/data2.json')
    #     fs = FileSystem(path)

    #     fs.write_json(inputOrderJson)


    #     fs2 = FileSystem(path)
    #     result = fs2.read()

    #     self.assertEqual(result['string'][0]['key'], 'string_no1')

    def result_write_test(self):
        path = os.path.join(os.getcwd(), 'file/data.json')
        fs = FileSystem(path)
        json = fs.read()

        print('path: ', path)
        print(json)

        result = HwpGenerator(json).run()

        path2 = os.path.join(os.getcwd(), 'file/report.json')
        fs2 = FileSystem(path2)
        fs2.write_json(result)

        print('path2: ', path2)
        print(result)

        self.assertEqual()

if __name__ == '__main__':
    unittest.main()
