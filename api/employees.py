from flask import Blueprint, current_app, jsonify, request
from models import Employee

employees_bp = Blueprint('employees_bp', __name__)

@employees_bp.route('/', methods=['GET'])
def get_employees():
    employees = current_app.orion.query_entities('Employee', limit=100)
    return jsonify(employees)

@employees_bp.route('/', methods=['POST'])
def create_employee():
    data = request.get_json() or {}
    entity_id = data.get('id') or f"urn:ngsi-ld:Employee:{data.get('username', '').lower()}"
    employee = Employee(entity_id, data['name'], data['email'], data.get('dateOfContract', ''), data.get('skills', []), data.get('username', ''), data.get('password', ''), data.get('category', ''), data.get('refStore', ''))
    payload = employee.to_ngsi()
    current_app.orion.create_entity(payload)
    return jsonify({'status': 'created', 'id': entity_id}), 201

@employees_bp.route('/<entity_id>', methods=['GET'])
def get_employee(entity_id):
    employee = current_app.orion.get_entity(entity_id)
    return jsonify(employee)

@employees_bp.route('/<entity_id>', methods=['PATCH'])
def update_employee(entity_id):
    attrs = request.get_json() or {}
    current_app.orion.update_entity(entity_id, attrs)
    return jsonify({'status': 'updated'})

@employees_bp.route('/<entity_id>', methods=['DELETE'])
def delete_employee(entity_id):
    current_app.orion.delete_entity(entity_id)
    return jsonify({'status': 'deleted'})
