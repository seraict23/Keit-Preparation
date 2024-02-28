from dto.hwp_result_dto import HwpResult
from hwp import HwpGenerator
from utils import *
import sys
from .settings import INPUT_FILE_FOLDER, RESULT_FILE_FOLDER, TEMPLATE_FOLDER, WORKNODE_NAME

def main(input_file_name):
    # redis client manager 시작
    redisCli = RedisClientManager()
    if redisCli.get(WORKNODE_NAME) == None:
        failReport = {
            "success": False, 
            "hwp_file": ""
        }
        fs2 = FileSystem(RESULT_FILE_FOLDER, 'report_'+input_file_name)
        fs2.write_pydantic(failReport)
        return False

    fs = FileSystem(INPUT_FILE_FOLDER, input_file_name)
    jsonfile = fs.read()
    pydanticObject = InputOrderDto(**jsonfile)

    result = HwpGenerator(pydanticObject).run()

    fs2 = FileSystem(RESULT_FILE_FOLDER, 'report_'+input_file_name)
    fs2.write_pydantic(result)

    # redis finish
    redisCli.delete_slow(WORKNODE_NAME)

if __name__ == "__main__":
    main('data.json')
 