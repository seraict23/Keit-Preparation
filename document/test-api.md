### test api spec.


### hwp response json type
```json
{
    "id": "document-id",
    "content": {
        "string": [{
            "id": "string-id",
            "content": "content"
        }],
        "table": [{
            "id": "id",
            "content": [{
                "row": "1",
                "col": "1",
                "value": "value1"
            },
            {
                "row": "1",
                "col": "2",
                "value": "value2"
            },
            {
                "row": "1",
                "col": "3",
                "value": "value3"
            }]
        }],
        "image": [{
            "id": "id",
            "uri": "url"
        }]
    }
}
```

### example
```json
{
    "id": "document-25",
    "content": {
        "string": [{
            "id": "string-1",
            "content": "string_test_1"
        },
        {
            "id": "string-2",
            "content": "string_test_2"
        }],
        "table": [{
            "id": "table-1",
            "content": [{
                "row": "1",
                "col": "1",
                "value": "value1"
            },
            {
                "row": "1",
                "col": "2",
                "value": "value2"
            },
            {
                "row": "1",
                "col": "3",
                "value": "value3"
            }]
        }],
        "image": [{
            "id": "image-1",
            "uri": "url"
        }]
    }
}
```

### HWP request json type
```json
{
    "id": "document-id",
    "status": "FAIL|SUCCESS",
    "file-uri": "hwp file url"
}
```

### example
```json
{
    "id": "document-25",
    "status": "SUCCESS",
    "file-uri": "hwp file url"
}
```
