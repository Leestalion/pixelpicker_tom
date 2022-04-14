from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from ..schemas.schemas import user_schema
from ..models.user import User

ERROR_NO_EMAIL = 400
ERROR_NO_PASSWORD = 401
ERROR_NO_USER_FOUND_WITH_EMAIL = 402
ERROR_NO_NAME = 403
EMAIL_ALREADY_IN_USE = 404
NAME_ALREADY_IN_USE = 405
WRONG_CREDENTIALS = 406

auth_bp = Blueprint(
    "auth_bp", __name__,
    template_folder= 'templates',
    static_folder='static'
)


@auth_bp.route('/login', methods=['POST'])
def login():
	"""
	Login : send the JWT token with the user corresponding to the demanded user.
	"""

	# get requests objects 

	data = request.get_json()
	email = data['email']
	password = data['password']

	if not email:
		return jsonify({"error": ERROR_NO_EMAIL}), 200
	if not password:
		return jsonify({"error": ERROR_NO_PASSWORD}), 200

	existing_user_mail = User.query.filter_by(email = email).first()
	if (not existing_user_mail):
		return jsonify({"error": ERROR_NO_USER_FOUND_WITH_EMAIL}), 200

	user = User.authenticate(email, password)

	if not user:
		return jsonify({'error': WRONG_CREDENTIALS}), 200

	access_token = create_access_token(identity = user.get_id())
	response = jsonify({'access_token': access_token, 'user': user_schema.dump(user)})
	return response, 200


@auth_bp.route("/logout", methods=['POST'])
def logout():
	return jsonify({'success': 'logged out'}), 200


@auth_bp.route('/register', methods=['POST'])
def register():
	"""
	User register.
	"""

	# Get Request objects
	data = request.get_json()
	email = data['email']
	name = data['name']
	password = data['password']

	if not email:
		return jsonify({"error": ERROR_NO_EMAIL}), 200
	if not password:
		return jsonify({"error": ERROR_NO_PASSWORD}), 200
	if not name:
		return jsonify({"error": ERROR_NO_NAME}), 200

	existing_user_mail = User.query.filter_by(email = email).first()
	if (existing_user_mail):
		return jsonify({"error": EMAIL_ALREADY_IN_USE}), 200

	existing_user_name = User.query.filter_by(name = name).first()
	if (existing_user_name):
		return jsonify({"error": NAME_ALREADY_IN_USE}), 200

	user = User.create(name=name, email=email, password=password)

	access_token = create_access_token(identity = user.get_id())
	response = jsonify({'access_token': access_token, 'user': user_schema.dump(user)})
	return response, 200