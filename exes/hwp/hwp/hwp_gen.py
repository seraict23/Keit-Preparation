from dto import HwpResult
from ..settings import *
import shutil
import json

class HwpGenerator:
    def __init__(self, json_data):
        self.file_folder = INPUT_FILE_FOLDER
        self.filename = json_data.meta.filename

        self.template_folder = TEMPLATE_FOLDER
        self.template = json_data.meta.template

        self.result_folder = RESULT_FILE_FOLDER

        self.hwp = None
        self.hwp_filename = ""
        pass

    def before_start(self):
        shutil.copyfile(
            './'+self.template_folder + '/' + self.template_folder, 
            './'+self.file_folder + '/' + self.filename, 
            )
        pass

    def open(self):
        pass

    def save_and_quit(self):
        pass

    def put_string(self):
        pass

    def put_table(self):
        pass

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
            "hwp_file": self.hwp_filename
        }))
