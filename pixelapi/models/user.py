from .. import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """User accound model."""
    __tablename__="user"

    # Columns
    user_id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))

    # Relationship
    pixel = db.relationship('Pixel', backref = "user")

    def __init__(self, name, email, password) -> None:
        super().__init__()
        self.name = name
        self.email = email
        self.password = generate_password_hash(password, method='sha256')

    def __repr__(self) -> str:
        return self.name

    @staticmethod
    def create(name, email, password):
        user = User(
            name = name,
            email = email,
            password = password,
        )
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def authenticate(cls, email, password):
        if not email or not password:
            return None
        user = cls.query.filter_by(email = email).first()
        if not user or not check_password_hash(user.password, password):
            return None
        return user

    def get_id(self):
        return self.user_id