import requests


class OrionClient:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')

    def _url(self, path):
        return f'{self.base_url}{path}'

    def create_entity(self, entity):
        response = requests.post(self._url('/v2/entities'), json=entity)
        response.raise_for_status()
        return response.json() if response.content else {}

    def get_entity(self, entity_id, attrs=None):
        url = self._url(f'/v2/entities/{entity_id}')
        params = {}
        if attrs:
            params['attrs'] = attrs
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def update_entity(self, entity_id, attrs):
        response = requests.patch(self._url(f'/v2/entities/{entity_id}/attrs'), json=attrs, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        return response.json() if response.content else {}

    def delete_entity(self, entity_id):
        response = requests.delete(self._url(f'/v2/entities/{entity_id}'))
        response.raise_for_status()
        return {}

    def query_entities(self, type_name, limit=100, q=None):
        params = {'type': type_name, 'limit': limit}
        if q:
            params['q'] = q
        response = requests.get(self._url('/v2/entities'), params=params)
        response.raise_for_status()
        return response.json()

    def create_subscription(self, subscription_payload):
        response = requests.post(self._url('/v2/subscriptions'), json=subscription_payload, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        return response.json()

    def delete_subscription(self, subscription_id):
        response = requests.delete(self._url(f'/v2/subscriptions/{subscription_id}'))
        response.raise_for_status()
        return {}

    def get_subscriptions(self):
        response = requests.get(self._url('/v2/subscriptions'))
        response.raise_for_status()
        return response.json()

    def register_provider(self, registration_payload):
        response = requests.post(self._url('/v2/registrations'), json=registration_payload, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        return response.json()

    def get_registrations(self):
        response = requests.get(self._url('/v2/registrations'))
        response.raise_for_status()
        return response.json()
