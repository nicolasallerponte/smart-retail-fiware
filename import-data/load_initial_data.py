import os
import time

from orion_client import OrionClient
from models import Store, Shelf, Product, Employee, InventoryItem

ORION_URL = os.getenv('ORION_URL', 'http://localhost:1026')

STORES = [
    Store('urn:ngsi-ld:Store:store1', 'Central Warehouse', 'https://store1.local', '+34 912 345 678', 'ES', 5000, 'Main warehouse', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Amazon_Fulfillment_Center.jpg/640px-Amazon_Fulfillment_Center.jpg', 'Calle Principal 123, Madrid'),
    Store('urn:ngsi-ld:Store:store2', 'Northern Hub', 'https://store2.local', '+33 1 42 34 56 78', 'FR', 3500, 'Northern logistic hub', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Logistics_center.jpg/640px-Logistics_center.jpg', '123 Rue du Nord, Paris'),
    Store('urn:ngsi-ld:Store:store3', 'Eastern Distribution', 'https://store3.local', '+49 30 98765432', 'DE', 4200, 'Eastern distribution point', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Warehouse_Interior.jpg/640px-Warehouse_Interior.jpg', 'Musterstrasse 5, Berlin'),
    Store('urn:ngsi-ld:Store:store4', 'Southern Logistics', 'https://store4.local', '+39 06 12345678', 'IT', 3800, 'Southern logistics base', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Warehouse_exterior.jpg/640px-Warehouse_exterior.jpg', 'Via Roma 1, Milan'),
]

SHELVES = []
for store_index, store in enumerate(STORES, start=1):
    for i in range(1, 5):
        shelf_id = f'urn:ngsi-ld:Shelf:s{store_index}_{i}'
        SHELVES.append(Shelf(shelf_id, store.id, f'Section {chr(64 + i)} - Level {i}', i-1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Pallet_racking_storage.jpg/640px-Pallet_racking_storage.jpg'))

PRODUCTS = [
    Product('urn:ngsi-ld:Product:prod1', 'Industrial Motor', 149.99, 'Large', '#FF5733', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Electric_motor.jpg/640px-Electric_motor.jpg'),
    Product('urn:ngsi-ld:Product:prod2', 'Control Panel', 89.50, 'Medium', '#33FF57', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Electrical_control_panel.jpg/640px-Electrical_control_panel.jpg'),
    Product('urn:ngsi-ld:Product:prod3', 'Safety Helmet', 24.99, 'One Size', '#FFFF33', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Construction_helmet.jpg/640px-Construction_helmet.jpg'),
    Product('urn:ngsi-ld:Product:prod4', 'Work Gloves', 12.99, 'Medium', '#33FFFF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Work_gloves.jpg/640px-Work_gloves.jpg'),
    Product('urn:ngsi-ld:Product:prod5', 'Hydraulic Pump', 299.99, 'Large', '#FF33FF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Hydraulic_pump.jpg/640px-Hydraulic_pump.jpg'),
    Product('urn:ngsi-ld:Product:prod6', 'Pressure Gauge', 45.00, 'Small', '#00FF00', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Manometer_01.jpg/640px-Manometer_01.jpg'),
    Product('urn:ngsi-ld:Product:prod7', 'Steel Cable', 34.75, 'Medium', '#C0C0C0', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Steel_wire_rope.jpg/640px-Steel_wire_rope.jpg'),
    Product('urn:ngsi-ld:Product:prod8', 'LED Light Strip', 27.50, 'Medium', '#FFD700', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/LED_strip_light.jpg/640px-LED_strip_light.jpg'),
    Product('urn:ngsi-ld:Product:prod9', 'Battery Pack', 68.00, 'Small', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Li-ion_battery_pack.jpg/640px-Li-ion_battery_pack.jpg'),
    Product('urn:ngsi-ld:Product:prod10', 'Tool Kit', 125.00, 'Large', '#FF7F00', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Tool_kit.jpg/640px-Tool_kit.jpg'),
]

EMPLOYEES = [
    Employee('urn:ngsi-ld:Employee:emp1', 'Carlos García', 'carlos@company.es', '2024-01-15', ['MachineryDriving', 'WritingReports'], 'cgarcia', 'hashed_pass1', 'Manager', STORES[0].id, 'https://randomuser.me/api/portraits/men/1.jpg'),
    Employee('urn:ngsi-ld:Employee:emp2', 'Marie Dupont', 'marie@company.fr', '2024-02-01', ['CustomerRelationships', 'WritingReports'], 'mdupont', 'hashed_pass2', 'Supervisor', STORES[1].id, 'https://randomuser.me/api/portraits/women/1.jpg'),
    Employee('urn:ngsi-ld:Employee:emp3', 'Hans Mueller', 'hans@company.de', '2024-03-05', ['MachineryDriving'], 'hmueller', 'hashed_pass3', 'Operator', STORES[2].id, 'https://randomuser.me/api/portraits/men/2.jpg'),
    Employee('urn:ngsi-ld:Employee:emp4', 'Giulia Rossi', 'giulia@company.it', '2024-03-18', ['MachineryDriving', 'CustomerRelationships'], 'grossi', 'hashed_pass4', 'Operator', STORES[3].id, 'https://randomuser.me/api/portraits/women/2.jpg'),
]


def delete_all_entities(orion):
    print('Deleting existing entities...')
    types = ['Store', 'Shelf', 'Product', 'Employee', 'InventoryItem']
    for t in types:
        try:
            entities = orion.query_entities(t, limit=1000)
            for e in entities:
                try:
                    orion.delete_entity(e['id'])
                    print(f"Deleted {e['id']}")
                except Exception as ex:
                    print(f"Failed to delete {e['id']}: {ex}")
        except Exception as ex:
            print(f"Failed to query type {t}: {ex}")

def main():
    orion = OrionClient(ORION_URL)
    delete_all_entities(orion)

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
