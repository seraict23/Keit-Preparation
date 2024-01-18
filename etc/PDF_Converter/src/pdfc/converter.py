import os, glob, shutil
from pypdf import PdfReader, PdfWriter
import win32com.client as win32
from ..utils.create_directory import createDirectory
from ..utils.gen_py_killer import genpyKiller


class PDFConverter:
    def __init__(self, data) :
        self.__filename = data['filename']
        self.__title = None
        self.__page = int(data['page'])
        self.__path = str(os.getcwd())
        self.__tempFolder = data['temp_folder']
        self.__genpy = data['genpy']

   # @property
    def getFilename(self):
        return self.__filename
    
   # @property
    def getTitle(self):
        return self.__title
    
   # @property
    def getPage(self):
        return self.__page
    
   # @property
    def getPath(self):
        return self.__path
    
   # @property
    def getTempFolder(self):
        return self.__tempFolder
    
   # @getFilename.setter
    def setFilename(self, filename):
        self.__filename = filename

   # @getTitle.setter
    def setTitle(self, title):
        self.__title = title

   # @getPage.setter
    def setPage(self, page):
        self.__page = page

   # @getTempFolder.setter
    def setPage(self, tempFolder):
        self.__tempFolder = tempFolder

    def crop(self) :
        cropped_pdf_folder = os.path.join(self.__path, self.__tempFolder)
        file_full_path = os.path.join(self.__path, self.__filename)

        createDirectory(cropped_pdf_folder)

        for i in os.listdir(cropped_pdf_folder):
            os.remove(cropped_pdf_folder+"\\"+i)

        for pdf in glob.glob(self.__filename):
            reader = PdfReader(pdf)

            if self.__title is not None:
                for num_page, page in enumerate(reader.pages, start=1):
                    text = str(page.extract_text())

                    if self.__title in text :
                        print("crop page")
                        writer = PdfWriter()
                        writer.add_page(page)
                        with open(cropped_pdf_folder + "\\_result.pdf", "wb") as fp:
                            writer.write(fp)

            elif self.__page is not None:
                for num_page, page in enumerate(reader.pages, start=1):
                    text = str(page.extract_text())

                    if num_page == self.__page :
                        print("crop page")
                        writer = PdfWriter()
                        writer.add_page(page)
                        with open(cropped_pdf_folder + "\\_result.pdf", "wb") as fp:
                            writer.write(fp)

            else:
                print("There is no indicator from which to extract data")


    def extract(self):
        result = dict()
        try:
            genpyKiller(self.__genpy)

            word = win32.gencache.EnsureDispatch('Word.Application')
            word.Visible = True

            PDFfile = str(os.path.join(self.__path, self.__tempFolder, "_result.pdf"))
            word.Documents.Open(PDFfile)
            doc=word.ActiveDocument
            
            tables = doc.Tables
            table = tables(1)

            for i in range(1, table.Rows.Count+1):
                row_dict = dict()
                for j in range(1, table.Columns.Count+1):
                    try:
                        col = "col_"+str(j)
                        value = str(table.Cell(Row=i, Column=j).Range.Text.replace('\r\x07','').replace('\r',''))
                        row_dict[col] = value
                    except :
                        # print("no cell in " + str(i) + ", " + str(j))
                        pass
                row = "row_"+str(i)
                result[row] = row_dict

            print(result)
            try:
                doc.Close(SaveChanges=win32.constants.wdDoNotSaveChanges)
            except:
                print("fail to close")
        except Exception as e:
            print(e)
            # word.Quit()
        finally:
            try:
                word.Quit()
                print("success")
            except:
                print("nothing to close")

        return result