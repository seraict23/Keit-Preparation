import sys, os

firstPath = sys.argv[1]
secondPath = sys.argv[2]

print(firstPath, secondPath)

with open('test.txt', "w", encoding='utf-8') as fs:
    fs.write(firstPath + secondPath)