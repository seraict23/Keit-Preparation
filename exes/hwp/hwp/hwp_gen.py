from dto import HwpResult
from dto import InputOrderDto
from ..settings import *
from pathlib import Path
import shutil, json

class HwpGenerator:
    def __init__(self, json_data: InputOrderDto):
        self.file_folder = INPUT_FILE_FOLDER
        self.filename = json_data.meta.filename

        self.template_folder = TEMPLATE_FOLDER
        self.template = json_data.meta.template

        self.hwp = None
        self.hwp_filename = ""

        self.string_data = json_data.string
        self.table_data = json_data.table
        self.image_data = json_data.image

        self.error_list = []
        pass

    def before_start(self):
        shutil.copyfile(
            './'+self.template_folder + '/' + self.template_folder, 
            './'+self.file_folder + '/' + self.filename, 
            )
        pass

    def open(self):
        BASE_DIR = Path(__file__).resolve()
        PATH = str(BASE_DIR)+"/"+self.file_folder+"/"+self.filename

        hwp = win32.gencache.EnsureDispatch("HWPFrame.HwpObject")
        hwp.XHwpWindows.Item(0).Visible = False
        hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModuleExample")

        hwp.Open(PATH, "HWP", "forceopen:true")
        self.hwp = hwp

    def save_and_quit(self):
        BASE_DIR = Path(__file__).resolve()
        # result_path = str(BASE_DIR)+"/"+self.result_folder+"/"+self.filename
        # hwp.SaveAs(result_path)
        self.hwp.Save()
        self.hwp.Quit()

    def put_string(self):
        data = self.string_data
        field_list = self.hwp.GetFieldList().split("\x02")

        for i in data:
            if i in field_list:
                self.hwp.PutFieldText(i, data[i])
            else:
                self.error_list.append('{i} 데이터에 해당하는 필드가 템플릿 내에 존재하지 않습니다.')

    def put_table(self):
        data = self.table_data

        for table in data:
            text_idx = 0
            col_count = int(table.value[-1].col)+1
            row_count = int(table.value[-1].row)+1

            self.hwp.MoveToField(table.key, False, False, False)

            for row in range(0, row_count):
                for col in range(0, col_count):
                    self.hwp.HAction.GetDefault("InsertText", self.hwp.HParameterSet.HInsertText.HSet)
                    self.hwp.HParameterSet.HInsertText.Text = table.value[text_idx].value
                    self.hwp.HAction.Execute("InsertText", self.hwp.HParameterSet.HInsertText.HSet)

                    if col<col_count-1 :
                        self.hwp.HAction.Run("MoveRight")
                    
                    text_idx += 1

            if (row<row_count-1) :
                self.hwp.HAction.Run("MoveDown")
                self.hwp.HAction.Run("TableColBegin")

    def put_image(self):
        pass

    def after_finish(self):
        pass

    def run(self):
        self.before_start()
        # self.open()
        # self.put_string()
        # self.put_table()
        # self.put_image()
        # self.save_and_quit()
        self.after_finish()

        return HwpResult.model_validate_json(json.dumps({
            "success": True,
            "hwp_file": self.hwp_filename,
            "error": self.error_list
        }))


class HwpRunner(Thread):

    '''
    HwpRunner가 받는 input parameter는 PydanticDto 임을 유의할것
    '''
    def __init__(self, param):
        self.param = param
        super().__init__()

    def run(self):
        # 서브 스레드에서 COM 객체를 사용하려면 COM 라이브러리를 초기화 해야함
        pythoncom.CoInitialize()

        result = HwpGenerator(self.param).run()

        # 사용 후 uninitialize
        pythoncom.CoUninitialize()

        return result
