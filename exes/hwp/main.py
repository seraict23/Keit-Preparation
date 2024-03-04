from dto.hwp_result_dto import HwpResult
from hwp import HwpRunner
from utils import *
from settings import INPUT_FILE_FOLDER, RESULT_FILE_FOLDER, TEMPLATE_FOLDER, WORKNODE_NAME, ERROR_REDIS_KEY

def main(input_file_name):
    # redis client manager 시작
    redisCli = RedisClientManager()
    redisCli.delete(ERROR_REDIS_KEY)
    redisCli.set(WORKNODE_NAME, 'hi')

    if redisCli.get(WORKNODE_NAME) == None:
        failReport = {
            "success": False, 
            "hwp_file": "",
            "error": []
        }
        fs2 = FileSystem(RESULT_FILE_FOLDER, 'report_'+input_file_name)
        fs2.write_pydantic(HwpResult(**failReport))
        return False

    fs = FileSystem(INPUT_FILE_FOLDER, input_file_name)
    jsonfile = fs.read()
    pydanticObject = InputOrderDto(**jsonfile)

    print("read file: ", pydanticObject.model_dump_json())

    result = HwpRunner(pydanticObject)
    result.start()
    result.join()

    # get error report
    error_count = redisCli.get_length_of_list(ERROR_REDIS_KEY)

    error_list = []
    for i in range(error_count):
        error = redisCli.pop_tail(ERROR_REDIS_KEY)
        error_list.append(error)    

    if (error_count == 0) :
        result_json = {
            "success": True, 
            "hwp_file": pydanticObject.meta.filename,
            "error": []
        }
    else :
        result_json = {
            "success": False, 
            "hwp_file": pydanticObject.meta.filename,
            "error": error_list
        }
    
    result_file: HwpResult = HwpResult(**result_json)

    fs2 = FileSystem(RESULT_FILE_FOLDER, 'report_'+input_file_name)
    fs2.write_pydantic(result_file)


    # redis finish
    redisCli.delete_slow(WORKNODE_NAME)

if __name__ == "__main__":
    main('data.json')
