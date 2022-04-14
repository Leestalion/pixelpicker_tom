from .. import db
from sqlalchemy.dialects import mysql

class Pixel(db.Model):
    """User accound model."""
    __tablename__="pixel"

    # Columns
    pixel_id = db.Column(db.Integer(), primary_key = True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.user_id'))
    x = db.Column(mysql.INTEGER(16))
    y = db.Column(mysql.INTEGER(16))
    xParcel = db.Column(mysql.INTEGER(8))
    yParcel = db.Column(mysql.INTEGER(8))
    color = db.Column(mysql.CHAR(6))

    @staticmethod
    def create(user_id, x, y, xParcel, yParcel, color):
        pixel = Pixel(
            user_id = user_id,
            x = x,
            y = y,
            xParcel = xParcel,
            yParcel = yParcel,
            color = color,
        )
        db.session.add(pixel)
        db.session.commit()
        return pixel

    @staticmethod
    def deleteById(pixel_id):
        pixel = Pixel.query.filter_by(pixel_id = pixel_id).first()
        if not pixel:
            return False
        db.session.delete(pixel)
        db.commit()

