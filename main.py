import eel

eel.init('www')

eel.start(
    'index.html',
    mode='edge',      # Opens in app mode
    host='localhost',
    port=8000,        # Must match if using 8000
    block=True
)