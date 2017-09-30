from . import home
from flask import current_app
from app import logger


@home.route("")
def home():
    return "Welcome home"
