## polling-process test

### 1. need docker
If you don't have docker, install it.

### 2. get redis
https://hub.docker.com/_/redis
```
docker run --name {container name you want} -p 6379:6379 -d redis
```

### 3. check redis (optional)
```
docker exec -it {container name} redis-cli
```

 - basic tutorial
```
keys *  // shows all keys
set test hello-world    // set test as a key hello-world as a value
keys *
get test    // get
del test    // del
keys *
```

 - expire seconds

```
set test2 hello-world ex 3  // lasts only 3 seconds
keys *
(after 3seconds) keys *
```

 - exit from redis-cli

```
exit
( or )ctrl+d
```

### 4. download package
```
npm install
```

### 5. run the code
```
node index.js --init=true
```
> --init=false or nothing : continue count
>
> --init=true : make count 0