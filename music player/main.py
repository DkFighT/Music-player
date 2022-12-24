import eel, os
import subprocess

full_path = os.path.realpath('./web/music')

eel.init('web')

@eel.expose
def imp_files():
    mass = []
    for file in os.listdir(full_path):
        if file.endswith(".mp3"):
            mass.append(os.path.join(full_path, file))
    return mass

@eel.expose
def imp_names():
    mass = []
    for file in os.listdir(full_path):
        if file.endswith(".mp3"):
            mass.append(file)
    return mass

@eel.expose
def open_dir():
    subprocess.Popen(f'explorer "{full_path}"')

eel.start('../html/index.html', size=(420, 800))