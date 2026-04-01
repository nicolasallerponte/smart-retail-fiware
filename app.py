import os
import logging
from flask import Flask, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO

from api.products import products_bp
from api.stores import stores_bp
from api.employees import employees_bp
from api.shelves import shelves_bp
from api.inventoryitems import inventoryitems_bp
from orion_client import OrionClient


def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_mapping(
        ORION_URL=os.getenv('ORION_URL', 'http://host.docker.internal:1026'),
    )

    CORS(app)

    socketio = SocketIO(app, cors_allowed_origins="*")

    app.orion = OrionClient(app.config['ORION_URL'])

    # Register context providers and subscriptions
    try:
        # Register providers
        registrations = app.orion.get_registrations()
        existing_descriptions = [r.get('description') for r in registrations]
        
        if "Temperature and Humidity Provider" not in existing_descriptions:
            app.orion.register_provider({
                "description": "Temperature and Humidity Provider",
                "dataProviderURL": "http://host.docker.internal:3001",
                "entities": [{"type": "Store", "isPattern": True}],
                "attrs": ["temperature", "relativeHumidity"]
            })
        
        if "Tweets Provider" not in existing_descriptions:
            app.orion.register_provider({
                "description": "Tweets Provider",
                "dataProviderURL": "http://host.docker.internal:3001",
                "entities": [{"type": "Store", "isPattern": True}],
                "attrs": ["tweets"]
            })
        
        # Create subscriptions
        subscriptions = app.orion.get_subscriptions()
        existing_subs = [s.get('description') for s in subscriptions]
        
        if "Product Price Change Subscription" not in existing_subs:
            app.orion.create_subscription({
                "description": "Product Price Change Subscription",
                "subject": {
                    "entities": [{"type": "Product"}],
                    "condition": {"attrs": ["price"]}
                },
                "notification": {
                    "http": {"url": "http://host.docker.internal:5000/orion/notifications"},
                    "attrs": ["price"]
                }
            })
        
        if "Low Stock Alert Subscription" not in existing_subs:
            app.orion.create_subscription({
                "description": "Low Stock Alert Subscription",
                "subject": {
                    "entities": [{"type": "InventoryItem"}],
                    "condition": {
                        "attrs": ["stockCount"],
                        "expression": {"q": "stockCount<5"}
                    }
                },
                "notification": {
                    "http": {"url": "http://host.docker.internal:5000/orion/notifications"},
                    "attrs": ["stockCount", "productId", "storeId"]
                }
            })
    except Exception as e:
        logging.warning(f"Failed to register providers/subscriptions: {e}")

    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(stores_bp, url_prefix='/api/stores')
    app.register_blueprint(employees_bp, url_prefix='/api/employees')
    app.register_blueprint(shelves_bp, url_prefix='/api/shelves')
    app.register_blueprint(inventoryitems_bp, url_prefix='/api/inventoryitems')

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/products')
    def products_page():
        return render_template('products.html')

    @app.route('/stores')
    def stores_page():
        return render_template('stores.html')

    @app.route('/employees')
    def employees_page():
        return render_template('employees.html')

    @app.route('/orion/notifications', methods=['POST'])
    def handle_notification():
        data = request.get_json()
        for entity in data.get('data', []):
            entity_id = entity['id']
            entity_type = entity['type']
            if entity_type == 'Product':
                price = entity.get('price', {}).get('value')
                socketio.emit('price_change', {'productId': entity_id, 'newPrice': price})
            elif entity_type == 'InventoryItem':
                stock_count = entity.get('stockCount', {}).get('value')
                product_id = entity.get('productId', {}).get('value')
                store_id = entity.get('storeId', {}).get('value')
                socketio.emit('low_stock', {'inventoryItemId': entity_id, 'stockCount': stock_count, 'productId': product_id, 'storeId': store_id})
        return '', 200

    return app


if __name__ == '__main__':
    app = create_app()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
