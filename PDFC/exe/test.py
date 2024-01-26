import sys, os

rootPath = sys.argv[1]
toPath = sys.argv[2]

f = open(f"{rootPath}", "r")
data = f.readline()
f.close()

f2 = open(f"{toPath}", "w")
f2.write(data)
f2.close()
