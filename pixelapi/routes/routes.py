from flask import Blueprint, jsonify, request

from ..models.pixel import Pixel
from ..schemas.schemas import pixel_schema, pixels_schema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


main_bp = Blueprint(
    'main_bp', __name__,
    template_folder = 'templates',
    static_folder= 'static'
)

@main_bp.route("/ping", methods=['GET'])
def ping_pong():
    return jsonify('pong!')

@main_bp.route("/csrf", methods=["GET"])
def csrf():
    return jsonify({'success': "success"}), 200


@main_bp.route("/pixel", methods=["GET", "POST", "DELETE"])
@jwt_required()
def pixel():
    print("bonsoir")
    if request.method == 'GET':
        x = request.args.get("x")
        y = request.ars.get("y")
        xParcel = request.args.get("xParcel")
        yParcel = request.args.get("yParcel")
        if x is not None and y is not None:
            """get a pixel"""
            return jsonify({'pixel': pixel_schema.dump(Pixel.query.filter(x = x, y = y).one())}), 200

        elif xParcel is not None and yParcel is not None:
            """get all pixels in a parcel"""
            return jsonify({'pixels': pixels_schema.dump(Pixel.query.filter(xParcel = xParcel, yParcel = yParcel).all())}), 200
        
        else:
            """get all pixels"""
            return jsonify({'pixels': pixels_schema.dump(Pixel.query.all())}), 200
    
    if request.method == 'POST':
        """create a pixel"""

        # Get Request objects
        data = request.get_json()
        print(data)
        user_id = data['user_id']
        x = data['pxRow']
        y = data['pxColumn']
        xParcel = data['xParsec']
        yParcel = data['yParsec']
        color = data['color']

        if user_id is None or x is None or y is None or xParcel is None or yParcel is None or color is None:
            return jsonify({'error': 'Missing parameter.'})
        
        pixel = Pixel.create(user_id, x, y, xParcel, yParcel, color)
        return jsonify({'pixel': pixel_schema.dump(pixel)}), 200

    
    if request.method == 'DELETE':
        """delete a pixel"""
        pixel_id = request.args("pixel_id")
        if pixel_id is None:
            return jsonify({'error': 'No pixel Id has been given.'}), 200

        result = Pixel.deleteById(pixel_id = pixel_id)
        if not result:
            return jsonify({'error': 'No pixel has been found with this id.'}), 200
        
        return jsonify({"success": True}), 200