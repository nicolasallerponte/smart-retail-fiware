from flask import Blueprint, current_app, jsonify, request
from models import Store

stores_bp = Blueprint('stores_bp', __name__)

@stores_bp.route('/', methods=['GET'])
def get_stores():
    stores = current_app.orion.query_entities('Store', limit=100)
    return jsonify(stores)

@stores_bp.route('/', methods=['POST'])
def create_store():
    data = request.get_json() or {}
    entity_id = data.get('id') or f"urn:ngsi-ld:Store:{data.get('name', '').replace(' ', '').lower()}"
    store = Store(entity_id, data['name'], data.get('url', ''), data.get('telephone', ''), data.get('countryCode', ''), data.get('capacity', 0), data.get('description', ''), data.get('image', ''), address=data.get('address', ''))
    payload = store.to_ngsi()
    current_app.orion.create_entity(payload)
    return jsonify({'status': 'created', 'id': entity_id}), 201

@stores_bp.route('/<entity_id>', methods=['GET'])
def get_store(entity_id):
    store = current_app.orion.get_entity(entity_id)
    return jsonify(store)

@stores_bp.route('/<entity_id>', methods=['PATCH'])
def update_store(entity_id):
    attrs = request.get_json() or {}
    current_app.orion.update_entity(entity_id, attrs)
    return jsonify({'status': 'updated'})

@stores_bp.route('/<entity_id>', methods=['DELETE'])
def delete_store(entity_id):
    current_app.orion.delete_entity(entity_id)
    return jsonify({'status': 'deleted'})
