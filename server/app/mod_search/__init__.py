from flask import Blueprint

search_mod = Blueprint(name="search", import_name=__name__, url_prefix="/search")

from . import views
