from enum import auto
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

from ..models.user import User
from ..models.pixel import Pixel

class UserSchema(SQLAlchemySchema):
    class Meta:
        model = User

    user_id = auto_field()
    name = auto_field()
    email = auto_field()

class PixelSchema(SQLAlchemySchema):
    class Meta:
        model = Pixel
    
    pixel_id = auto_field()
    x = auto_field()
    y = auto_field()
    xParcel = auto_field()
    yParcel = auto_field()
    color = auto_field()


user_schema = UserSchema()
users_schema = UserSchema(many = True)

pixel_schema = PixelSchema()
pixels_schema = PixelSchema(many = True)