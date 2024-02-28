import ftplib

ftp = ftplib.FTP()
ftp.connect(host='localhost', port=3101)
ftp.login(user='root', passwd='4854')

print(ftp.dir())