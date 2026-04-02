from flask import Blueprint, current_app, jsonify, request
from models import Shelf

shelves_bp = Blueprint('shelves_bp', __name__)

@shelves_bp.route('/', methods=['GET'])
def get_shelves():
    store_id = request.args.get('storeId')
    q = None
    if store_id:
        if not store_id.startswith('urn:ngsi-ld:'):
            store_id = f'urn:ngsi-ld:Store:{store_id}'
        q = f"storeId=='{store_id}'"
    shelves = current_app.orion.query_entities('Shelf', limit=500, q=q)
    return jsonify(shelves)

@shelves_bp.route('/', methods=['POST'])
def create_shelf():
    data = request.get_json() or {}
    entity_id = data.get('id') or f"urn:ngsi-ld:Shelf:{data.get('name', '').replace(' ', '').lower()}"
    shelf = Shelf(entity_id, data['storeId'], data['name'], data.get('level', 0), data.get('image', ''))
    payload = shelf.to_ngsi()
    current_app.orion.create_entity(payload)
    return jsonify({'status': 'created', 'id': entity_id}), 201

def normalize_shelf_entity_id(entity_id):
    if not entity_id.startswith('urn:ngsi-ld:'):
        return f'urn:ngsi-ld:Shelf:{entity_id}'
    return entity_id

@shelves_bp.route('/<entity_id>', methods=['GET'])
def get_shelf(entity_id):
    entity_id = normalize_shelf_entity_id(entity_id)
    shelf = current_app.orion.get_entity(entity_id)
    return jsonify(shelf)

@shelves_bp.route('/<entity_id>', methods=['PATCH'])
def update_shelf(entity_id):
    entity_id = normalize_shelf_entity_id(entity_id)
    attrs = request.get_json() or {}
    current_app.orion.update_entity(entity_id, attrs)
    return jsonify({'status': 'updated'})

@shelves_bp.route('/<entity_id>', methods=['DELETE'])
def delete_shelf(entity_id):
    current_app.orion.delete_entity(entity_id)
    return jsonify({'status': 'deleted'})
