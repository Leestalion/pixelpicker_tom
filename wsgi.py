from pixelapi import create_app

from werkzeug.wrappers import Response
from werkzeug.middleware.dispatcher import DispatcherMiddleware

app = DispatcherMiddleware(Response('Not Found', status=404), {'/api': create_app()})

if __name__=='__main__':
    from werkzeug.serving import run_simple
    run_simple('127.0.0.1', 5000, app, use_debugger=True, use_reloader=True, threaded=True)