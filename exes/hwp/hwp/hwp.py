from pathlib import Path
import shutil
import uuid
from time import sleep
import win32com.client as win32


class ExteriorBrickThread(Thread):
        def __init__(self, paramDict, basic):
            self.paramDict = paramDict
            self.basic = basic
            super().__init__()

        def run(self):
            # 서브 스레드에서 COM 객체를 사용하려면 COM 라이브러리를 초기화 해야함
            pythoncom.CoInitialize()

            paramDict = self.paramDict
            basic = self.basic
            ExteriorBrickHWP(paramDict, basic)
            tresprint.exterior_brick = True
            tresprint.save()

            # 사용 후 uninitialize
            pythoncom.CoUninitialize()


def openhwp(filename, boolean=False):
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    PATH = str(BASE_DIR)+"/static/hwp_templates"
    TEMPPATH = str(BASE_DIR)+"/static/hwp_templates_tmp"

    # 파일 tmp 폴더로 복제
    filefrom = PATH+"/"+filename+".hwp"
    fileto = TEMPPATH+"/"+str(uuid.uuid4())
    shutil.copyfile(filefrom, fileto)

    hwp = win32.gencache.EnsureDispatch("HWPFrame.HwpObject")
    hwp.XHwpWindows.Item(0).Visible = boolean
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModuleExample")

    hwp.Open(fileto, "HWP", "forceopen:true")
    return hwp


def openResultHwp(filename, path: str, boolean=False):
    if path.strip()[-1] == "/" or path.strip()[-1] == "\\":
        PATH = path
    else:
        PATH = path+'/'

    hwp = win32.gencache.EnsureDispatch("HWPFrame.HwpObject")
    hwp.XHwpWindows.Item(0).Visible = boolean
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModuleExample")

    hwp.Open(PATH+"result/"+filename+".hwp", "HWP", "forceopen:true")
    return hwp


def fielder(hwp, map: dict, valueDict: dict):
    fieldList = hwp.GetFieldList().split("\x02")
    keyList = map.keys()
    # print(fieldList)
    for i in fieldList:
        if i in keyList:
            hwp.PutFieldText(i, valueDict[map[i]])
    return hwp


def simpleFielder(hwp, valueDict: dict):
    fieldList = hwp.GetFieldList().split("\x02")
    keyList = valueDict.keys()
    # print(fieldList)
    for i in fieldList:
        if i in keyList:
            hwp.PutFieldText(i, valueDict[i])
    return hwp


def imager(hwp, fieldName, imgName, width=70.0, height=65.0):

    BASE_DIR = Path(__file__).resolve().parent.parent
    PATH = str(BASE_DIR)+"/src/pics"
    
    print(PATH+"/"+imgName)
    
    hwp.HAction.Run("MoveDocEnd")
    hwp.InsertPicture(PATH+"/" + imgName, Embedded=True)
    sleep(2)
    hwp.FindCtrl()
    hwp.HAction.GetDefault("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)

    # 크기 변경
    hwp.HParameterSet.HShapeObject.Width = hwp.MiliToHwpUnit(width)
    hwp.HParameterSet.HShapeObject.Height = hwp.MiliToHwpUnit(height)
    hwp.HAction.Execute("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)

    # 잘라내서 위치에 붙이기
    hwp.HAction.Run("Cut")
    hwp.HAction.GetDefault("RepeatFind", hwp.HParameterSet.HFindReplace.HSet)
    hwp.HParameterSet.HFindReplace.FindString = fieldName
    hwp.HParameterSet.HFindReplace.IgnoreMessage = 1
    hwp.HAction.Execute("RepeatFind", hwp.HParameterSet.HFindReplace.HSet)

    hwp.HAction.GetDefault("Paste", hwp.HParameterSet.HSelectionOpt.HSet)
    hwp.HAction.Execute("Paste", hwp.HParameterSet.HSelectionOpt.HSet)

    return hwp


def saveAndQuit(hwp, fileName, basicIDpath, headerExist = True):
    dirarr = basicIDpath.replace('\\', '/').split('/')

    print(dirarr)

    if headerExist:
        headerList = []
        headerText = ""
        paramtext = dirarr.pop()

        if headerText == "":
            paramtext = dirarr.pop()

        print("##########", fileName+" saving##########")
        print(paramtext)
       
        yearhalf = paramtext.split('-')[1]
        year = yearhalf[0:4]+"년"
        half = yearhalf[4:]

        headerList.append(paramtext.split('-')[2])
        headerList.append(year)
        headerList.append(half)
        headerText = " ".join(headerList) + " 건축시설물 정기안전점검"

        Header(hwp, headerText)

    hwp.SaveAs(basicIDpath+"result/" + fileName+'.hwp')

    hwp.Quit()

    sleep(1)


# 딕셔너리에 키 추가
def appendDict(target:dict, value:dict):
    keyList = value.keys()
    for i in keyList:
        target[i]= value[i]
    return target


# 표 새로 만들기
def newTable(hwp):
    return hwp


# 표 작성 하기 : 일렬 리스트일때
def tableMaker(hwp, startField, row, col, list, newRow = True):
    hwp.MoveToField(startField, False, False, False)

    if (row > 1) and (newRow):
        hwp.HAction.GetDefault("TableInsertRowColumn", hwp.HParameterSet.HTableInsertLine.HSet)
        hwp.HParameterSet.HTableInsertLine.Side = hwp.SideType("Bottom")
        hwp.HParameterSet.HTableInsertLine.Count = row-1
        hwp.HAction.Execute("TableInsertRowColumn", hwp.HParameterSet.HTableInsertLine.HSet)

    # print(list)

    for i in range(row):
        for j in range(col):
            text = list.pop(0)
            print(text)
            hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
            hwp.HParameterSet.HInsertText.Text = text
            hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)

            if (j<col-1):
                hwp.HAction.Run("MoveRight")
            else:
                if i > 0 :
                    hwp.HAction.Run("TableCellBlock")
                    hwp.HAction.Run("TableCellBlockExtend")
                    hwp.HAction.Run("TableColBegin")
                    hwp.HAction.GetDefault("CellBorder", hwp.HParameterSet.HCellBorderFill.HSet)
                    hwp.HParameterSet.HCellBorderFill.BorderWidthTop = 2
                    hwp.HParameterSet.HCellBorderFill.BorderTypeTop = hwp.HwpLineType("Solid")
                    hwp.HAction.Execute("CellBorderFill", hwp.HParameterSet.HCellBorderFill.HSet)
                    hwp.HAction.Run("Cancel")
            sleep(0.05)

        if (i<row-1) :
            hwp.HAction.Run("MoveDown")
            sleep(0.05)
            hwp.HAction.Run("TableColBegin")
            sleep(0.05)
    return hwp


# 표 작성 2차원 배열
def tableMaker_list2d(hwp, startField, row, col, list2d, newRow = True, passFirstCol = False):
    hwp.MoveToField(startField, False, False, False)

    if (row > 1) and (newRow):
        hwp.HAction.GetDefault("TableInsertRowColumn", hwp.HParameterSet.HTableInsertLine.HSet)
        hwp.HParameterSet.HTableInsertLine.Side = hwp.SideType("Bottom")
        hwp.HParameterSet.HTableInsertLine.Count = row-1
        hwp.HAction.Execute("TableInsertRowColumn", hwp.HParameterSet.HTableInsertLine.HSet)
    # print(list2d)
    for i in range(row):
        for j in range(col):
            text = list2d[i][j]
            hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
            hwp.HParameterSet.HInsertText.Text = text
            hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)



            if (j<col-1):
                hwp.HAction.Run("MoveRight")
            else:
                # 2째줄 부터는 탑 솔리드 라인
                if i > 0 :
                    hwp.HAction.Run("TableCellBlock")
                    hwp.HAction.Run("TableCellBlockExtend")
                    hwp.HAction.Run("TableColBegin")
                    hwp.HAction.GetDefault("CellBorder", hwp.HParameterSet.HCellBorderFill.HSet)
                    hwp.HParameterSet.HCellBorderFill.BorderWidthTop = 2
                    hwp.HParameterSet.HCellBorderFill.BorderTypeTop = hwp.HwpLineType("Solid")
                    hwp.HAction.Execute("CellBorderFill", hwp.HParameterSet.HCellBorderFill.HSet)
                    hwp.HAction.Run("Cancel")
            sleep(0.02)

        if (i<row-1) :
            hwp.HAction.Run("MoveDown")
            sleep(0.05)
            hwp.HAction.Run("TableColBegin")

            if passFirstCol:
                hwp.HAction.Run("TableCellBlock")
                hwp.HAction.Run("TableRightCell")
                hwp.HAction.Run("Cancel")
            sleep(0.05)

    return hwp


def tableMaker_1Line(hwp, col, list, firstRow=False, startField='startpoint'):
    if firstRow:
        hwp.MoveToField(startField, False, False, False)

    for j in range(col):
        text = list[j]
        hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
        hwp.HParameterSet.HInsertText.Text = text
        hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)
        sleep(0.05)
        if (j<col-1):
            hwp.HAction.Run("MoveRight")
            sleep(0.02)

    try:
        hwp.HAction.Run("MoveDown")
        sleep(0.05)
        hwp.HAction.Run("TableColBegin")
        sleep(0.05)
    except Exception as e:
        print(e)

    return hwp


def tableMaker_titleLine(hwp, text, firstRow=False, startField='startpoint'):
    try:
        if firstRow:
            hwp.MoveToField(startField, True, False, False)

        hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
        hwp.HParameterSet.HInsertText.Text = text
        hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)
        hwp.HAction.Run("TableCellBlock")
        hwp.HAction.Run("TableCellBlockRow")
        hwp.HAction.Run("TableMergeCell")
        hwp.HAction.Run("ParagraphShapeAlignLeft")
        sleep(0.7)
        
        hwp.HAction.Run("MoveDown")
        hwp.HAction.Run("TableColEnd")
        hwp.HAction.Run("TableColBegin")
        
    except Exception as e:
        print(e)

    return hwp


# 이미지테이블
def imageTable(hwp, positionName, imgList:list, width=75.0, height=65.0):

    BASE_DIR = Path(__file__).resolve().parent.parent
    PATH = str(BASE_DIR)+"/src/pics"

    for imgName in imgList:
        hwp.InsertPicture(PATH+"/" + imgName, Embedded=True)
        sleep(0.5)
        hwp.FindCtrl()

        # 크기 변경
        hwp.HAction.GetDefault("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)
        hwp.HParameterSet.HShapeObject.Width = hwp.MiliToHwpUnit(width)
        hwp.HParameterSet.HShapeObject.Height = hwp.MiliToHwpUnit(height)
        hwp.HAction.Execute("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)

        # 잘라내서 위치에 붙이기
        hwp.HAction.Run("Cut")
        hwp.HAction.GetDefault("RepeatFind", hwp.HParameterSet.HFindReplace.HSet)
        hwp.HParameterSet.HFindReplace.FindString = positionName
        hwp.HParameterSet.HFindReplace.IgnoreMessage = 1
        hwp.HAction.Execute("RepeatFind", hwp.HParameterSet.HFindReplace.HSet)

        hwp.HAction.GetDefault("Paste", hwp.HParameterSet.HSelectionOpt.HSet)
        hwp.HAction.Execute("Paste", hwp.HParameterSet.HSelectionOpt.HSet)

        sleep(0.1)
        hwp.HAction.Run("MoveRight")

    return hwp


# 누름틀에 이미지 삽입
def imagerFielder(hwp, fieldName, imgFullPath, width=75.0, height=65.0):
    
    hwp.MoveToField(fieldName, True, False, False)
    hwp.InsertPicture(imgFullPath, Embedded=True)
    sleep(0.5)
    hwp.FindCtrl()

    # 크기 변경
    hwp.HAction.GetDefault("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)
    hwp.HParameterSet.HShapeObject.Width = hwp.MiliToHwpUnit(width)
    hwp.HParameterSet.HShapeObject.Height = hwp.MiliToHwpUnit(height)
    hwp.HAction.Execute("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)

    return hwp


# 머지
def merger(sFileFullPath, oFileFullPath):

    hwp = win32.gencache.EnsureDispatch("HWPFrame.HwpObject")
    hwp.XHwpWindows.Item(0).Visible = False
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModuleExample")

    hwp.Open(sFileFullPath+".hwp","HWP","forceopen:true")
    hwp.HAction.Run("MoveDocEnd")

    hwp.HAction.GetDefault("InsertFile", hwp.HParameterSet.HInsertFile.HSet)
    option=hwp.HParameterSet.HInsertFile
    option.filename = oFileFullPath+".hwp"
    option.KeepSection = 1
    option.KeepCharshape = 1
    option.KeepParashape = 1
    option.KeepStyle = 1
    hwp.HAction.Execute("InsertFile", hwp.HParameterSet.HInsertFile.HSet)
    
    new_filename = sFileFullPath +".hwp"
    hwp.SaveAs(new_filename)
    hwp.Quit()
    sleep(1)


def multiMerge():
    pass


def Header():
    # function OnScriptMacro_script24()
    # {
    #     HAction.GetDefault("HeaderFooter", HParameterSet.HHeaderFooter.HSet);
    #     with (HParameterSet.HHeaderFooter)
    #     {
    #         HSet.SetItem("HeaderFooterStyle", 0);
    #         HSet.SetItem("HeaderFooterCtrlType", 0);
    #     }
    #     HAction.Execute("HeaderFooter", HParameterSet.HHeaderFooter.HSet);
    #     HAction.GetDefault("InsertText", HParameterSet.HInsertText.HSet);
    #     HParameterSet.HInsertText.Text = "용인에버그린아파트";
    #     HAction.Execute("InsertText", HParameterSet.HInsertText.HSet);
    #     HAction.Run("BreakPara");
    #     HAction.Run("DeleteBack");
    #     HAction.Run("CloseEx");
    # }
    pass


def DWGImg(hwp, filePathName, height=240, width=160):
    # print(filePathName)
    
    # hwp.HAction.Run("MoveDocBegin")
    hwp.InsertPicture(filePathName, Embedded=True)
    sleep(0.5)
    hwp.FindCtrl()

    # 크기 변경
    hwp.HAction.GetDefault("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)
    hwp.HParameterSet.HShapeObject.Width = hwp.MiliToHwpUnit(width)
    hwp.HParameterSet.HShapeObject.Height = hwp.MiliToHwpUnit(height)
    hwp.HAction.Execute("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)

    hwp.HAction.GetDefault("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)
    HSO = hwp.HParameterSet.HShapeObject
    HSO.HorzOffset = hwp.MiliToHwpUnit(0.0)
    HSO.VertRelTo = hwp.VertRel("Page")
    HSO.TreatAsChar = 1
    HSO.HSet.SetItem("ShapeType", 1)
    HSO.HorzAlign = hwp.HAlign("Center")
    HSO.VertOffset = hwp.MiliToHwpUnit(0.0)
    HSO.VertAlign = hwp.VAlign("Center")
    HSO.HSet.SetItem("ShapeType", 1)
    hwp.HAction.Execute("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)

    hwp.Run("Close")

    # 가운데 정렬
    # hwp.FindCtrl()
    # hwp.HAction.Run("ParagraphShapeAlignCenter")
    
    return hwp


def CtrlEnter(hwp):
    hwp.HAction.Run("MoveDocBegin")
    hwp.HAction.Run("MoveDocEnd")
    hwp.HAction.Run("BreakPage")
    return hwp



def TextToTable(hwp):
    pass


def PDFAttacher(hwp):
    return hwp


def Header(hwp, headerText):
    hwp.HAction.Run("MoveDocBegin")
    hwp.HAction.GetDefault("HeaderFooter", hwp.HParameterSet.HHeaderFooter.HSet)
    header = hwp.HParameterSet.HHeaderFooter
    header.HSet.SetItem("HeaderFooterStyle", 0)
    header.HSet.SetItem("HeaderFooterCtrlType", 0)

    hwp.HAction.Execute("HeaderFooter", hwp.HParameterSet.HHeaderFooter.HSet)
    hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.HParameterSet.HInsertText.Text = headerText
    hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.HAction.Run("CloseEx")

    return hwp


def FieldCellFill(hwp, fieldname:str):
    hwp.MoveToField(fieldname, True, False, False)
    hwp.HAction.Run("TableCellBlock")
    hwp.HAction.Run("CharShapeBold")
    
    hwp.HAction.GetDefault("CellBorderFill", hwp.HParameterSet.HCellBorderFill.HSet)
    HBF = hwp.HParameterSet.HCellBorderFill
    # print(HBF.FillAttr.__dict__.keys())
    HBF.FillAttr.type = hwp.BrushType("NullBrush|WinBrush")
    HBF.FillAttr.WinBrushFaceColor = hwp.RGBColor(216, 216, 216)
    HBF.FillAttr.WinBrushHatchColor = hwp.RGBColor(216, 216, 216)
    HBF.FillAttr.WinBrushFaceStyle = hwp.HatchStyle("None")
    HBF.FillAttr.WindowsBrush = 1
    hwp.HAction.Execute("CellBorderFill", hwp.HParameterSet.HCellBorderFill.HSet)

    hwp.HAction.Run("Cancel")
    return hwp


def StringToTable(hwp, stringFinder):
    hwp.HAction.Run("MoveDocBegin")
    hwp.HAction.GetDefault("RepeatFind", hwp.HParameterSet.HFindReplace.HSet)
	
    Finder = hwp.HParameterSet.HFindReplace
    Finder.ReplaceString = ""
    Finder.FindString = stringFinder
    Finder.IgnoreReplaceString = 0
    Finder.IgnoreFindString = 0
    Finder.Direction = hwp.FindDir("Forward")
    Finder.WholeWordOnly = 0
    Finder.UseWildCards = 0
    Finder.SeveralWords = 0
    Finder.AllWordForms = 0
    Finder.MatchCase = 0
    Finder.ReplaceMode = 0
    Finder.ReplaceStyle = ""
    Finder.FindStyle = ""
    Finder.FindRegExp = 0
    Finder.FindJaso = 0
    Finder.HanjaFromHangul = 0
    Finder.IgnoreMessage = 1
    Finder.FindType = 1
    hwp.HAction.Execute("RepeatFind", Finder.HSet)

    hwp.HAction.Run("MoveSelLineEnd")

    hwp.HAction.GetDefault("TableStringToTable", hwp.HParameterSet.HTableStrToTbl.HSet)
    StrTable =hwp.HParameterSet.HTableStrToTbl

    StrTable.TableCreation.Rows = 1
    StrTable.TableCreation.Cols = 2
    StrTable.TableCreation.WidthType = 1
    StrTable.TableCreation.HeightType = 0
    StrTable.TableCreation.WidthValue = hwp.MiliToHwpUnit(143.0)
    StrTable.TableCreation.HeightValue = hwp.MiliToHwpUnit(36.0)
    StrTable.TableCreation.CreateItemArray("ColWidth", 2)
    StrTable.TableCreation.ColWidth.SetItem(0, hwp.MiliToHwpUnit(70.4))
    StrTable.TableCreation.ColWidth.SetItem(1, hwp.MiliToHwpUnit(70.4))
    StrTable.TableCreation.CreateItemArray("RowHeight", 1)
    StrTable.TableCreation.RowHeight.SetItem(0, hwp.MiliToHwpUnit(0.0))
    StrTable.TableCreation.TableProperties.CellMarginLeft = hwp.MiliToHwpUnit(1.8)
    StrTable.TableCreation.TableProperties.CellMarginRight = hwp.MiliToHwpUnit(1.8)
    StrTable.TableCreation.TableProperties.CellMarginTop = hwp.MiliToHwpUnit(0.5)
    StrTable.TableCreation.TableProperties.CellMarginBottom = hwp.MiliToHwpUnit(0.5)
    StrTable.TableCreation.TableProperties.HorzRelTo = hwp.HorzRel("Column")
    StrTable.TableCreation.TableProperties.VertRelTo = hwp.VertRel("Para")
    StrTable.TableCreation.TableProperties.FlowWithText = 1
    StrTable.TableCreation.TableProperties.TextWrap = hwp.TextWrapType("TopAndBottom")
    StrTable.TableCreation.TableProperties.WidthRelTo = hwp.WidthRel("Absolute")
    StrTable.TableCreation.TableProperties.HeightRelTo = hwp.HeightRel("Absolute")
    StrTable.TableCreation.TableProperties.AllowOverlap = 0
    StrTable.TableCreation.TableProperties.TreatAsChar = 0
    StrTable.TableCreation.TableProperties.VertAlign = hwp.VAlign("Top")
    StrTable.TableCreation.TableProperties.HorzAlign = hwp.HAlign("Justify")
    StrTable.TableCreation.TableProperties.Width = 41954
    StrTable.TableCreation.TableProperties.Height = 0
    StrTable.TableCreation.TableProperties.TextFlow = hwp.TextFlowType("BothSides")
    StrTable.TableCreation.TableProperties.OutsideMarginLeft = hwp.MiliToHwpUnit(1.0)
    StrTable.TableCreation.TableProperties.OutsideMarginRight = hwp.MiliToHwpUnit(1.0)
    StrTable.TableCreation.TableProperties.OutsideMarginTop = hwp.MiliToHwpUnit(1.0)
    StrTable.TableCreation.TableProperties.OutsideMarginBottom = hwp.MiliToHwpUnit(1.0)
    StrTable.TableCreation.TableProperties.HoldAnchorObj = 0
    StrTable.AutoOrDefine = 1
    StrTable.DelimiterType = hwp.Delimiter("SemiBreve")
    StrTable.UserDefine = ""
    StrTable.DelimiterEtc = ""
    hwp.HAction.Execute("TableStringToTable", hwp.HParameterSet.HTableStrToTbl.HSet)

    return hwp


def StringImg(hwp, stringFinder, imgFilePath, width=82.00, height=65.00):
    hwp.HAction.GetDefault("RepeatFind", hwp.HParameterSet.HFindReplace.HSet)
	
    Finder = hwp.HParameterSet.HFindReplace
    Finder.ReplaceString = ""
    Finder.FindString = stringFinder
    Finder.IgnoreReplaceString = 0
    Finder.IgnoreFindString = 0
    Finder.Direction = hwp.FindDir("Forward")
    Finder.WholeWordOnly = 0
    Finder.UseWildCards = 0
    Finder.SeveralWords = 0
    Finder.AllWordForms = 0
    Finder.MatchCase = 0
    Finder.ReplaceMode = 0
    Finder.ReplaceStyle = ""
    Finder.FindStyle = ""
    Finder.FindRegExp = 0
    Finder.FindJaso = 0
    Finder.HanjaFromHangul = 0
    Finder.IgnoreMessage = 1
    Finder.FindType = 1
    hwp.HAction.Execute("RepeatFind", Finder.HSet)
    
    hwp.HAction.Run("DeleteBack")

    hwp.InsertPicture(imgFilePath, Embedded=True, sizeoption=3)

    hwp.FindCtrl()

    # 크기 변경
    hwp.HAction.GetDefault("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)
    hwp.HParameterSet.HShapeObject.TreatAsChar = 1
    hwp.HParameterSet.HShapeObject.Width = hwp.MiliToHwpUnit(width)
    hwp.HParameterSet.HShapeObject.Height = hwp.MiliToHwpUnit(height)
    hwp.HAction.Execute("ShapeObjDialog", hwp.HParameterSet.HShapeObject.HSet)

    return hwp
