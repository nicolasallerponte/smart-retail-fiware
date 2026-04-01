import os
import time

from orion_client import OrionClient
from models import Store, Shelf, Product, Employee, InventoryItem

ORION_URL = os.getenv('ORION_URL', 'http://localhost:1026')

STORES = [
    Store('urn:ngsi-ld:Store:store1', 'Central Warehouse', 'https://store1.local', '+34 912 345 678', 'ES', 5000, 'Main warehouse', 'https://via.placeholder.com/150', 'Calle Principal 123, Madrid'),
    Store('urn:ngsi-ld:Store:store2', 'Northern Hub', 'https://store2.local', '+33 1 42 34 56 78', 'FR', 3500, 'Northern logistic hub', 'https://via.placeholder.com/150', '123 Rue du Nord, Paris'),
    Store('urn:ngsi-ld:Store:store3', 'Eastern Distribution', 'https://store3.local', '+49 30 98765432', 'DE', 4200, 'Eastern distribution point', 'https://via.placeholder.com/150', 'Musterstrasse 5, Berlin'),
    Store('urn:ngsi-ld:Store:store4', 'Southern Logistics', 'https://store4.local', '+39 06 12345678', 'IT', 3800, 'Southern logistics base', 'https://via.placeholder.com/150', 'Via Roma 1, Milan'),
]

SHELVES = []
for store_index, store in enumerate(STORES, start=1):
    for i in range(1, 5):
        shelf_id = f'urn:ngsi-ld:Shelf:s{store_index}_{i}'
        SHELVES.append(Shelf(shelf_id, store.id, f'Section {chr(64 + i)} - Level {i}', i-1, 'https://via.placeholder.com/100'))

PRODUCTS = [
    Product('urn:ngsi-ld:Product:prod1', 'Industrial Motor', 149.99, 'Large', '#FF5733', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod2', 'Control Panel', 89.50, 'Medium', '#33FF57', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod3', 'Safety Helmet', 24.99, 'One Size', '#FFFF33', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod4', 'Work Gloves', 12.99, 'Medium', '#33FFFF', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod5', 'Hydraulic Pump', 299.99, 'Large', '#FF33FF', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod6', 'Pressure Gauge', 45.00, 'Small', '#00FF00', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod7', 'Steel Cable', 34.75, 'Medium', '#C0C0C0', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod8', 'LED Light Strip', 27.50, 'Medium', '#FFD700', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod9', 'Battery Pack', 68.00, 'Small', '#000000', 'https://via.placeholder.com/100'),
    Product('urn:ngsi-ld:Product:prod10', 'Tool Kit', 125.00, 'Large', '#FF7F00', 'https://via.placeholder.com/100'),
]

EMPLOYEES = [
    Employee('urn:ngsi-ld:Employee:emp1', 'Carlos García', 'carlos@company.es', '2024-01-15', ['MachineryDriving', 'WritingReports'], 'cgarcia', 'hashed_pass1', 'Manager', STORES[0].id),
    Employee('urn:ngsi-ld:Employee:emp2', 'Marie Dupont', 'marie@company.fr', '2024-02-01', ['CustomerRelationships', 'WritingReports'], 'mdupont', 'hashed_pass2', 'Supervisor', STORES[1].id),
    Employee('urn:ngsi-ld:Employee:emp3', 'Hans Mueller', 'hans@company.de', '2024-03-05', ['MachineryDriving'], 'hmueller', 'hashed_pass3', 'Operator', STORES[2].id),
    Employee('urn:ngsi-ld:Employee:emp4', 'Giulia Rossi', 'giulia@company.it', '2024-03-18', ['MachineryDriving', 'CustomerRelationships'], 'grossi', 'hashed_pass4', 'Operator', STORES[3].id),
]


def main():
    orion = OrionClient(ORION_URL)

    print('Creating stores...')
    for s in STORES:
        try:
            orion.create_entity(s.to_ngsi())
            print('Created', s.id)
        except Exception as e:
            print('Store creation failed', s.id, e)

    print('Creating shelves...')
    for s in SHELVES:
        try:
            orion.create_entity(s.to_ngsi())
            print('Created', s.id)
        except Exception as e:
            print('Shelf creation failed', s.id, e)

    print('Creating products...')
    for p in PRODUCTS:
        try:
            orion.create_entity(p.to_ngsi())
            print('Created', p.id)
        except Exception as e:
            print('Product creation failed', p.id, e)

    print('Creating employees...')
    for e in EMPLOYEES:
        try:
            orion.create_entity(e.to_ngsi())
            print('Created', e.id)
        except Exception as ex:
            print('Employee creation failed', e.id, ex)

    print('Creating inventory items...')
    inv_id = 1
    for shelf in SHELVES:
        for product in PRODUCTS[:4]:
            item_id = f'urn:ngsi-ld:InventoryItem:inv{inv_id:03d}'
            stock = 100 + (inv_id % 40)
            shelf_count = 20 + (inv_id % 12)
            item = InventoryItem(item_id, product.id, shelf.id, shelf.storeId, stock, shelf_count)
            try:
                orion.create_entity(item.to_ngsi())
                print('Created', item.id)
            except Exception as ex:
                print('InventoryItem creation failed', item.id, ex)
            inv_id += 1

    print('Initial data load complete.')


if __name__ == '__main__':
    main()
