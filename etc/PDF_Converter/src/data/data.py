from dotenv import load_dotenv
import os, sqlite3
load_dotenv()
    
class Client:    
    def __init__(self):
        self.FILENAME = None
        self.TEMP_FOLDER = None
        self.RESULT_FOLDER = None
        self.RESULT_FILENAME = None
        self.GENPY = os.environ.get("GENPY")
        self.PAGE = None
        self.TITLE = None
        self.con = None

    def load(self):
        self.FILENAME = os.environ.get("FILENAME")
        self.TEMP_FOLDER = os.environ.get("TEMP_FOLDER")
        self.RESULT_FOLDER = os.environ.get("RESULT_FOLDER")
        self.RESULT_FILENAME = os.environ.get("RESULT_FILENAME")
        self.GENPY = os.environ.get("GENPY")
        self.PAGE = os.environ.get("PAGE")
        return self
    
    def connect(self):
        self.con = sqlite3.connect('data.db')
        cur = self.con.cursor()
        # Create table
        cur.execute('''SELECT * FROM configuration''')
        result = cur.fetchall()[0]
        self.FILENAME = result[0]
        self.TEMP_FOLDER = result[1]
        self.RESULT_FOLDER = result[2]
        self.RESULT_FILENAME = result[3]
        self.PAGE = result[4]
        self.TITLE = result[5]
        print(self.FILENAME, self.TEMP_FOLDER, self.RESULT_FOLDER, self.RESULT_FILENAME, self.PAGE, self.TITLE)

        self.con.close()

        return self

    def create(self, dataArray):
        self.con = sqlite3.connect('data.db')
        cur = self.con.cursor()

        cur.execute('''DROP TABLE IF EXISTS configuration''')        
        cur.execute('''CREATE TABLE configuration
                    (filename text, tempfolder text, resultfolder text, resultfilename text, 
                    page text, 
                    title text default null)''')


        cur.execute("INSERT INTO configuration VALUES (?, ?, ?, ?, ?, ?)", dataArray)

        self.con.commit()
        self.con.close()
        
        self.GENPY = os.environ.get("GENPY")

        return self

    def eject(self):
        result = dict()
        
        result['filename'] = self.FILENAME
        result['temp_folder'] = self.TEMP_FOLDER
        result['result_folder'] = self.RESULT_FOLDER
        result['result_filename'] = self.RESULT_FILENAME
        result['page'] = self.PAGE
        result['genpy'] = self.GENPY
        result['title'] = self.TITLE

        return result

