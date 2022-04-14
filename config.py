from os import environ, path
from dotenv import load_dotenv
from datetime import timedelta


basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))

DEVELOPMENT='development'
PRODUCTION='production'

class Config:
    """Set Flask configuration from .env file"""

    # General Config
    SECRET_KEY = environ.get('SECRET_KEY')
    FLASK_APP = environ.get("FLASK_APP")
    FLASK_ENV = environ.get('FLASK_ENV')

    # MYSQL database parameters
    if(FLASK_ENV == DEVELOPMENT):
        DEBUG = True
        MYSQL_HOST =  environ.get('MYSQL_HOST_DEVELOPMENT')
        MYSQL_USER = environ.get("MYSQL_USER_DEVELOPMENT")
        MYSQL_PASSWORD = environ.get("MYSQL_PASSWORD_DEVELOPMENT")
        MYSQL_DB =  environ.get('MYSQL_DB_DEVELOPMENT')

    elif(FLASK_ENV == PRODUCTION):
        MYSQL_HOST =  environ.get('MYSQL_HOST_PROD')
        MYSQL_USER = environ.get("MYSQL_USER_PROD")
        MYSQL_PASSWORD = environ.get("MYSQL_PASSWORD_PROD")
        MYSQL_DB =  environ.get('MYSQL_DB_PROD')

    # SQL Alchemy parameters
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # if (FLASK_ENV == DEVELOPMENT):
    
    SQLALCHEMY_DATABASE_URI = "mysql://"+MYSQL_USER+":"+MYSQL_PASSWORD+"@"+MYSQL_HOST+"/"+MYSQL_DB
    SQLALCHEMY_ENGINE_URI = "mysql://"+MYSQL_USER+":"+MYSQL_PASSWORD+"@"+MYSQL_HOST
    # elif (FLASK_ENV == PRODUCTION):
    #     SQLALCHEMY_DATABASE_URI = "postgresql://"+MYSQL_USER+":"+MYSQL_PASSWORD+"@"+MYSQL_HOST+"/"+MYSQL_DB
    #     SQLALCHEMY_ENGINE_URI = "postgresql://"+MYSQL_USER+":"+MYSQL_PASSWORD+"@"+MYSQL_HOST
    # JWT Settings
    JWT_SECRET_KEY = environ.get("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=10)


    # WTF Settings
    WTF_CSRF_HEADERS = ["X-XSRF-TOKEN"]
    WTF_CSRF_TIME_LIMIT = None
    SECURITY_CSRF_COOKIE_NAME = "XSRF-TOKEN"
    SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS = True

    # CORS Settings
    CORS_ORIGINS = environ.get("CORS_ORIGINS")
    CORS_SUPPORT_CREDENTIALS = environ.get("CORS_SUPPORT_CREDENTIALS")