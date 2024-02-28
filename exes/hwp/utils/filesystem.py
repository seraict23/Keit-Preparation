import json
import os

from dto import InputOrderDto

class FileSystem:
    def __init__(self, folder_name, input_file_name):
        self.file_path = './' + folder_name + '/' + input_file_name

    def write_json(self, json_data):
        with open(self.file_path, 'w', encoding='UTF-8') as f:
            json.dump(json_data, f)

    def write_pydantic(self, pydantic_data):
        json_data = json.loads(pydantic_data.model_dump_json())
        with open(self.file_path, 'w', encoding='UTF-8') as f:
            json.dump(json_data, f)     
    
    def read(self) -> str:
        with open(self.file_path, 'r') as f:
            result = json.loads(f.read())
        return result
    
    def read_json_to_dto(self):
        json_data = self.read()
        result = InputOrderDto(**json_data)

        return result