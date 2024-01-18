import src.pdfc as pdfc
import src.data as data

if __name__ == "__main__":
    # default = data.Client().load().eject()
    default = data.Client().connect().eject()
    print(default)
    PDFC = pdfc.PDFConverter(default)
    PDFC.crop()
    result = PDFC.extract()
    pdfc.File(default).jsonify(result)
