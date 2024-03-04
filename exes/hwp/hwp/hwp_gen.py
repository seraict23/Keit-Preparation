from threading import Thread
import win32com.client as win32
import pythoncom
from dto import HwpResult
from dto import InputOrderDto
from settings import *
from pathlib import Path
import shutil, json, os

from utils.redis_cli import RedisClientManager

class HwpGenerator:
    def __init__(self, json_data: InputOrderDto):
        self.file_folder = INPUT_FILE_FOLDER.replace('/', '\\')
        self.filename = json_data.meta.filename

        self.template_folder = TEMPLATE_FOLDER.replace('/', '\\')
        self.template = json_data.meta.template

        self.result_folder = RESULT_FILE_FOLDER.replace('/', '\\')

        self.hwp = None
        self.hwp_filename = ""

        self.string_data = json_data.string
        self.table_data = json_data.table
        self.image_data = json_data.image

        self.error_list = []
        pass

    def before_start(self):
        shutil.copyfile(
            './'+self.template_folder + '/' + self.template, 
            './'+self.file_folder + '/' + self.filename,
            )
        pass

    def open(self):
        BASE_DIR = Path(__file__).resolve().parent.parent
        PATH = os.path.join(str(BASE_DIR), self.file_folder, self.filename)

        print("open path:", PATH)

        hwp = win32.gencache.EnsureDispatch("HWPFrame.HwpObject")
        hwp.XHwpWindows.Item(0).Visible = True
        hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModuleExample")

        hwp.Open(PATH, "HWP", "forceopen:true")
        self.hwp = hwp

    def save_and_quit(self):
        BASE_DIR = Path(__file__).resolve().parent.parent
        RESULT_PATH = os.path.join(str(BASE_DIR), self.result_folder, self.filename)

        print("save path:", RESULT_PATH)
        self.hwp.SaveAs(RESULT_PATH)
        # self.hwp.SaveAs()
        self.hwp.Quit()

    def put_string(self):
        data = self.string_data
        field_list = self.hwp.GetFieldList().split("\x02")

        for i in data:
            if i.key in field_list:
                self.hwp.PutFieldText(i.key, i.value)
            else:
                self.error_list.append('{i.key}에 해당하는 필드가 템플릿 내에 존재하지 않습니다.')

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
        for img in self.image_data:
    
            self.hwp.MoveToField(img.key, True, False, False)
            self.hwp.InsertPicture(img.url, Embedded=True)
            self.hwp.FindCtrl()

            # 크기 변경
            self.hwp.HAction.GetDefault("ShapeObjDialog", self.hwp.HParameterSet.HShapeObject.HSet)
            self.hwp.HParameterSet.HShapeObject.Width = self.hwp.MiliToHwpUnit(img.width)
            self.hwp.HParameterSet.HShapeObject.Height = self.hwp.MiliToHwpUnit(img.height)
            self.hwp.HAction.Execute("ShapeObjDialog", self.hwp.HParameterSet.HShapeObject.HSet)

    def after_finish(self):
        BASE_DIR = Path(__file__).resolve().parent.parent
        PATH = os.path.join(str(BASE_DIR), self.file_folder, self.filename)
        os.remove(PATH)

    def run(self):
        self.before_start()
        self.open()
        self.put_string()
        self.put_table()
        self.put_image()
        self.save_and_quit()
        self.after_finish()

        print(self.error_list)

        return self.error_list


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

        errors = HwpGenerator(self.param).run()

        redis_cli = RedisClientManager()
        for i in errors:
            redis_cli.push_head('hwp_work_node_errors', i)

        # 사용 후 uninitialize
        pythoncom.CoUninitialize()
