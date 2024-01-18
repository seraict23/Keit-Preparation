import click
from src.data import Client

@click.command()
@click.option('--name', default='test.pdf', help='input pdf file name')
@click.option('--temp', default='tmp', help='temporary folder name')
@click.option('--resultfolder', default='result', help='result folder name')
@click.option('--resultfile', default='data.json', help='result file name')
@click.option('--page', default='5', help='page you want to crop')
@click.option('--title', default=None, help='page you want to crop')
def set_data(name, temp, resultfolder, resultfile, page, title):
    click.echo(f'file name : {name}')
    click.echo(f'temp folder : {temp}')
    click.echo(f'resultfolder : {resultfolder}')
    click.echo(f'resultfile : {resultfile}')
    click.echo(f'page : {page}')
    click.echo(f'title : {title}')

    dataArray = [name, temp, resultfolder, resultfile, page, title]
    Client().create(dataArray)

if __name__ == '__main__':
    set_data()
