import os
import time

from orion_client import OrionClient
from models import Store, Shelf, Product, Employee, InventoryItem

ORION_URL = os.getenv('ORION_URL', 'http://localhost:1026')

STORES = [
    Store('urn:ngsi-ld:Store:store1', 'Central Warehouse', 'https://store1.local', '+34 912 345 678', 'ES', 5000, 'Main distribution hub for the Iberian Peninsula, handling bulk storage and last-mile logistics.', 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400', 'Calle de Alcalá 50, Madrid, Spain', temperature=20, relativeHumidity=52, tweets=['New shipment from Valencia arrived ahead of schedule. All units accounted for. #logistics', 'Safety inspection passed with top marks. Zero incidents this quarter! #safety', 'Capacity at 78%. Preparing expansion of Zone B before summer peak. #warehouse']),
    Store('urn:ngsi-ld:Store:store2', 'Northern Hub', 'https://store2.local', '+33 1 42 34 56 78', 'FR', 3500, 'High-throughput logistics centre serving Northern Europe with automated sorting systems.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', '15 Rue de la Paix, Paris, France', temperature=16, relativeHumidity=65, tweets=['Automated sorting line upgraded overnight. Processing speed up 30%. #automation', 'Cross-border shipments to Belgium and Netherlands cleared customs. #europe', 'Temperature sensors calibrated. Cold chain integrity confirmed for all perishable goods. #coldchain']),
    Store('urn:ngsi-ld:Store:store3', 'Eastern Distribution', 'https://store3.local', '+49 30 98765432', 'DE', 4200, 'State-of-the-art distribution point for Central and Eastern European markets.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', 'Alexanderplatz 1, Berlin, Germany', temperature=12, relativeHumidity=72, tweets=['Q1 KPIs exceeded: 99.2% on-time delivery rate. #performance #excellence', 'New forklift fleet deployed. Efficiency gains expected in Q2. #operations', 'Eastern European route optimisation complete. 15% fuel savings projected. #sustainability']),
    Store('urn:ngsi-ld:Store:store4', 'Southern Logistics', 'https://store4.local', '+39 06 12345678', 'IT', 3800, 'Mediterranean logistics base with specialised cold-chain capabilities and port access.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Piazza del Duomo 1, Milan, Italy', temperature=23, relativeHumidity=55, tweets=['Port connection upgrade complete. Direct container access now operational. #portlogistics', 'Cold-chain certification renewed for another 3 years. #quality #coldchain', 'Mediterranean summer peak prep underway. Extra staff contracted for July-August. #seasonal']),
]

SHELVES = []
for store_index, store in enumerate(STORES, start=1):
    for i in range(1, 5):
        shelf_id = f'urn:ngsi-ld:Shelf:s{store_index}_{i}'
        SHELVES.append(Shelf(shelf_id, store.id, f'Section {chr(64 + i)} - Level {i}', i-1, f'https://picsum.photos/seed/shelf{store_index}{i}/200/200'))

PRODUCTS = [
    Product('urn:ngsi-ld:Product:prod1', 'Industrial Motor',  149.99, 'Large',    '#C0392B', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200'),
    Product('urn:ngsi-ld:Product:prod2', 'Control Panel',      89.50, 'Medium',   '#2ECC71', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200'),
    Product('urn:ngsi-ld:Product:prod3', 'Safety Helmet',      24.99, 'One Size', '#F1C40F', 'https://images.unsplash.com/photo-1618090584176-7132b9911657?w=200'),
    Product('urn:ngsi-ld:Product:prod4', 'Work Gloves',        12.99, 'Medium',   '#1ABC9C', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200'),
    Product('urn:ngsi-ld:Product:prod5', 'Hydraulic Pump',    299.99, 'Large',    '#8E44AD', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200'),
    Product('urn:ngsi-ld:Product:prod6', 'Pressure Gauge',     45.00, 'Small',    '#27AE60', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200'),
    Product('urn:ngsi-ld:Product:prod7', 'Steel Cable',        34.75, 'Medium',   '#95A5A6', 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=200'),
    Product('urn:ngsi-ld:Product:prod8', 'LED Light Strip',    27.50, 'Medium',   '#F39C12', 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=200'),
    Product('urn:ngsi-ld:Product:prod9', 'Battery Pack',       68.00, 'Small',    '#2C3E50', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=200'),
    Product('urn:ngsi-ld:Product:prod10','Tool Kit',           125.00, 'Large',   '#E67E22', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200'),
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
