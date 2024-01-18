import shutil

def genpyKiller(path):
    try:
        shutil.rmtree(path)
    except:
        pass
