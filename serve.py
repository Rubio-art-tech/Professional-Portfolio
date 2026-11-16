"""Local preview server for the portfolio.

Serves the folder on http://127.0.0.1:8123 with caching disabled, so edits to
index.html, styles.css and script.js show up on every refresh.

    python serve.py
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

PORT = 8123


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    handler = partial(NoCacheHandler, directory=".")
    with ThreadingHTTPServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"Portfolio running at http://127.0.0.1:{PORT}/")
        httpd.serve_forever()
