from flask import Blueprint, current_app, jsonify, request
from models import Product

products_bp = Blueprint('products_bp', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    products = current_app.orion.query_entities('Product', limit=100)
    return jsonify(products)

@products_bp.route('/', methods=['POST'])
def create_product():
    data = request.get_json() or {}
    entity_id = data.get('id') or f"urn:ngsi-ld:Product:{data.get('name', '').replace(' ', '').lower()}"
    product = Product(entity_id, data['name'], data['price'], data.get('size', ''), data.get('color', '#000000'), data.get('image', ''))
    payload = product.to_ngsi()
    current_app.orion.create_entity(payload)
    return jsonify({'status': 'created', 'id': entity_id}), 201

def normalize_product_entity_id(entity_id):
    if not entity_id.startswith('urn:ngsi-ld:'):
        return f'urn:ngsi-ld:Product:{entity_id}'
    return entity_id

@products_bp.route('/<entity_id>', methods=['GET'])
def get_product(entity_id):
    entity_id = normalize_product_entity_id(entity_id)
    product = current_app.orion.get_entity(entity_id)
    return jsonify(product)

@products_bp.route('/<entity_id>', methods=['PATCH'])
def update_product(entity_id):
    entity_id = normalize_product_entity_id(entity_id)
    attrs = request.get_json() or {}
    current_app.orion.update_entity(entity_id, attrs)
    return jsonify({'status': 'updated'})

@products_bp.route('/<entity_id>', methods=['DELETE'])
def delete_product(entity_id):
    entity_id = normalize_product_entity_id(entity_id)
    current_app.orion.delete_entity(entity_id)
    return jsonify({'status': 'deleted'})
