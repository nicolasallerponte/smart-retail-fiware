import os
from flask import Flask, render_template
from flask_cors import CORS

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

    app.orion = OrionClient(app.config['ORION_URL'])

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

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
