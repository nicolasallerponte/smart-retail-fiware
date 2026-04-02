from flask import Blueprint, current_app, jsonify, request
from models import InventoryItem

inventoryitems_bp = Blueprint('inventoryitems_bp', __name__)

@inventoryitems_bp.route('/', methods=['GET'])
def get_inventoryitems():
    store_id = request.args.get('storeId')
    shelf_id = request.args.get('shelfId')
    q_clauses = []
    if store_id:
        if not store_id.startswith('urn:ngsi-ld:'):
            store_id = f'urn:ngsi-ld:Store:{store_id}'
        q_clauses.append(f"storeId=='{store_id}'")
    if shelf_id:
        if not shelf_id.startswith('urn:ngsi-ld:'):
            shelf_id = f'urn:ngsi-ld:Shelf:{shelf_id}'
        q_clauses.append(f"shelfId=='{shelf_id}'")
    q = ' and '.join(q_clauses) if q_clauses else None
    items = current_app.orion.query_entities('InventoryItem', limit=1000, q=q)
    return jsonify(items)

@inventoryitems_bp.route('/', methods=['POST'])
def create_inventoryitem():
    data = request.get_json() or {}
    entity_id = data.get('id') or f"urn:ngsi-ld:InventoryItem:{data.get('productId', '').split(':')[-1]}_{data.get('shelfId', '').split(':')[-1]}"
    item = InventoryItem(entity_id, data['productId'], data['shelfId'], data['storeId'], data.get('stockCount', 0), data.get('shelfCount', 0))
    payload = item.to_ngsi()
    current_app.orion.create_entity(payload)
    return jsonify({'status': 'created', 'id': entity_id}), 201

def normalize_inventoryitem_entity_id(entity_id):
    if not entity_id.startswith('urn:ngsi-ld:'):
        return f'urn:ngsi-ld:InventoryItem:{entity_id}'
    return entity_id

@inventoryitems_bp.route('/<entity_id>', methods=['GET'])
def get_inventoryitem(entity_id):
    entity_id = normalize_inventoryitem_entity_id(entity_id)
    item = current_app.orion.get_entity(entity_id)
    return jsonify(item)

@inventoryitems_bp.route('/<entity_id>', methods=['PATCH'])
def update_inventoryitem(entity_id):
    entity_id = normalize_inventoryitem_entity_id(entity_id)
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
