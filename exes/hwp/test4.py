
from utils.redis_cli import RedisClientManager


redisCli = RedisClientManager()

redisCli.push_head('test_list', 'hi1')
redisCli.push_head('test_list', 'hi2')
redisCli.push_head('test_list', 'hi3')

len_list = redisCli.get_length_of_list('test_list')

print("llen: ", len_list)

for i in range(0, len_list):
    print("pop_tail: ", redisCli.pop_tail('test_list'))