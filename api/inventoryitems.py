from flask import Blueprint, current_app, jsonify, request
from models import InventoryItem

inventoryitems_bp = Blueprint('inventoryitems_bp', __name__)

@inventoryitems_bp.route('/', methods=['GET'])
def get_inventoryitems():
    items = current_app.orion.query_entities('InventoryItem', limit=1000)
    return jsonify(items)

@inventoryitems_bp.route('/', methods=['POST'])
def create_inventoryitem():
    data = request.get_json() or {}
    entity_id = data.get('id') or f"urn:ngsi-ld:InventoryItem:{data.get('productId', '').split(':')[-1]}_{data.get('shelfId', '').split(':')[-1]}"
    item = InventoryItem(entity_id, data['productId'], data['shelfId'], data['storeId'], data.get('stockCount', 0), data.get('shelfCount', 0))
    payload = item.to_ngsi()
    current_app.orion.create_entity(payload)
    return jsonify({'status': 'created', 'id': entity_id}), 201

@inventoryitems_bp.route('/<entity_id>', methods=['GET'])
def get_inventoryitem(entity_id):
    item = current_app.orion.get_entity(entity_id)
    return jsonify(item)

@inventoryitems_bp.route('/<entity_id>', methods=['PATCH'])
def update_inventoryitem(entity_id):
    attrs = request.get_json() or {}
    current_app.orion.update_entity(entity_id, attrs)
    return jsonify({'status': 'updated'})

@inventoryitems_bp.route('/<entity_id>', methods=['DELETE'])
def delete_inventoryitem(entity_id):
    current_app.orion.delete_entity(entity_id)
    return jsonify({'status': 'deleted'})

@inventoryitems_bp.route('/<entity_id>/buy', methods=['PATCH'])
def buy_one(entity_id):
    payload = {
        "stockCount": {"type": "Integer", "value": {"$inc": -1}},
        "shelfCount": {"type": "Integer", "value": {"$inc": -1}}
    }
    current_app.orion.update_entity(entity_id, payload)
    return jsonify({'status': 'bought'})
