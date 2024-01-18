import json, os
from src.utils.create_directory import createDirectory

class File:
    def __init__(self, data):
        self.__name = data['result_filename']
        self.__path = os.getcwd()
        self.__folder = data['result_folder']

    def jsonify(self, dict_data):
        print('generating json file')
        print(dict_data)
        createDirectory(os.path.join(self.__path, self.__folder))
        path = os.path.join(self.__path, self.__folder, self.__name)
        with open(path, 'w', encoding='utf8') as outfile:
            json.dump(dict_data, outfile, indent=4, ensure_ascii=False)