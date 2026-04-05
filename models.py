from datetime import datetime


def safe_str(value):
    return str(value) if value is not None else ''


class Employee:
    def __init__(self, id, name, email, dateOfContract, skills, username, password, category=None, refStore=None, image=None):
        self.id = id
        self.name = name
        self.email = email
        self.dateOfContract = dateOfContract
        self.skills = skills
        self.username = username
        self.password = password
        self.category = category
        self.refStore = refStore
        self.image = image

    def to_ngsi(self):
        payload = {
            "id": self.id,
            "type": "Employee",
            "name": {"type": "String", "value": self.name},
            "email": {"type": "String", "value": self.email},
            "dateOfContract": {"type": "DateTime", "value": self.dateOfContract},
            "skills": {"type": "StructuredValue", "value": self.skills},
            "username": {"type": "String", "value": self.username},
            "password": {"type": "String", "value": self.password},
            "category": {"type": "String", "value": self.category or ""},
            "refStore": {"type": "String", "value": self.refStore or ""},
            "image": {"type": "String", "value": self.image or ""}
        }
        return payload


class Store:
    def __init__(self, id, name, url, telephone, countryCode, capacity, description, image, address=None, temperature=None, relativeHumidity=None, tweets=None):
        self.id = id
        self.name = name
        self.url = url
        self.telephone = telephone
        self.countryCode = countryCode
        self.capacity = capacity
        self.description = description
        self.image = image
        self.address = address
        self.temperature = temperature
        self.relativeHumidity = relativeHumidity
        self.tweets = tweets or []

    def to_ngsi(self):
        payload = {
            "id": self.id,
            "type": "Store",
            "name": {"type": "String", "value": self.name},
            "url": {"type": "String", "value": self.url},
            "telephone": {"type": "String", "value": self.telephone},
            "countryCode": {"type": "String", "value": self.countryCode},
            "capacity": {"type": "Number", "value": float(self.capacity)},
            "description": {"type": "String", "value": self.description},
            "image": {"type": "String", "value": self.image},
            "address": {"type": "String", "value": self.address or ""},
            "temperature": {"type": "Number", "value": self.temperature if self.temperature is not None else 0},
            "relativeHumidity": {"type": "Number", "value": self.relativeHumidity if self.relativeHumidity is not None else 0},
            "tweets": {"type": "StructuredValue", "value": self.tweets}
        }
        return payload


class Product:
    def __init__(self, id, name, price, size, color, image):
        self.id = id
        self.name = name
        self.price = price
        self.size = size
        self.color = color
        self.image = image

    def to_ngsi(self):
        return {
            "id": self.id,
            "type": "Product",
            "name": {"type": "String", "value": self.name},
            "price": {"type": "Number", "value": float(self.price)},
            "size": {"type": "String", "value": self.size},
            "color": {"type": "String", "value": self.color},
            "image": {"type": "String", "value": self.image}
        }


class Shelf:
    def __init__(self, id, storeId, name, level, image=None):
        self.id = id
        self.storeId = storeId
        self.name = name
        self.level = level
        self.image = image

    def to_ngsi(self):
        return {
            "id": self.id,
            "type": "Shelf",
            "storeId": {"type": "String", "value": self.storeId},
            "name": {"type": "String", "value": self.name},
            "level": {"type": "Integer", "value": int(self.level)},
            "image": {"type": "String", "value": self.image or ""}
        }


class InventoryItem:
    def __init__(self, id, productId, shelfId, storeId, stockCount, shelfCount):
        self.id = id
        self.productId = productId
        self.shelfId = shelfId
        self.storeId = storeId
        self.stockCount = stockCount
        self.shelfCount = shelfCount

    def to_ngsi(self):
        return {
            "id": self.id,
            "type": "InventoryItem",
            "productId": {"type": "String", "value": self.productId},
            "shelfId": {"type": "String", "value": self.shelfId},
            "storeId": {"type": "String", "value": self.storeId},
            "stockCount": {"type": "Integer", "value": int(self.stockCount)},
            "shelfCount": {"type": "Integer", "value": int(self.shelfCount)}
        }
