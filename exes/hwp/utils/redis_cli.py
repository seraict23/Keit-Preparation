import redis

class RedisClientManager:
    def __init__(self, host='localhost'):
        self.con = redis.Redis(
            host=host, port=6379
        )
        pass

    def set(self, key, value):
        self.con.set(key, value)

    def get(self, key):
        return self.con.get(key)
    
    def delete(self, key):
        self.con.delete(key)

    def delete_slow(self, key):
        self.con.set(key, "", 3)
