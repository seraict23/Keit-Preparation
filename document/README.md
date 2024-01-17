# Detailed Development Document - KEIT pre-Project

## Environment
- // Lang, Tools
- MS Office, HWP

## Architecture Note
> 해당 프로젝트는 KEIT 프로젝트 본격적으로 시작되기 이전에 시작하는 pre-build 임.

> client의 요구 또는 개발 환경에 따라 얼마든지 내용이 변경될 요소가 많다고 볼 수 있으므로, 비즈니스 로직과 어플리캐이션 로직을 엄격히 분리함으로써 설계 변경에도 유연하게 대응 할 수 있는 3계층 구조로 설계하였음.

> 모듈 객체를 Domain과 Service, Operation으로 각각 분리. 
Domain계층의 Object는 기본 로직을, Service계층의 Object는 어플리캐이션 로직을 담당하며, 
Operation 계층은 Service Object들이 배치된 최종 실행문 형태. 

## Directory Structure
```
-node_modules
-src
    -common
        -constant
        -interfaces
        -utils
    -config
    -domain
        -entity
        -util
    -operation
    -service
-test
package-lock
package
tsconfig
```

# Document


## Operation
> 1-Tier 모듈로서 실행 프로세스

### app
|Arguments|Type|Description|Note|
|-|-|-|-|
|task|Task||-|
|inputFile|FileObject||-|
|outputFile|FileObject||-|
|taskManager|TaskManager|-|-|
|fileManager|FileManager|-|-|
|jobManager|JobManager|-|-|
|resultManager|ResultManager|-|-|
|logManager|LogManager|-|-|
|runTaskManager|(void): Promise\<void>|서버로부터 새 임무를 받는다.|-|
|runFileManager|(Task): Promise\<void>|PDF: 임무에 해당하는 파일을 받는다    HWP: 임무를 Json지령문 파일로 변환한다.|-|
|runJobManager|(void): Promise\<void>|워크노드에 작업을 할당하고 임무에 해당하는 exe파일을 실행한다.|-|
|runResultManager|(void): Promise\<void>|결과로 나온 파일을 Json파일로 변환하여 서버로 전송한다.|-|
|run|(void): Promise\<void>|최종 실행 구문. main함수에서 해당 메서드를 호출하여 작업을 시행한다.|-|

> 모든 서비스 계층의 오브젝트로부터 의존성을 주입받는다. 
> run method는 다른 형제 method들을 활용하여 최종 실행문으로서 역할.

> - 작업대상 서버로부터 불러오기 -> Task 객체
> - 해당하는 파일 다운로드(pdf) | 생성(hwp) -> File 객체
> - 작업처리(exe 파일 실행)
> - 결과보고 Json, Log

## Service
> 2계층 모듈. 어플리캐이션 로직을 담당한다.

### FileManager

|Arguments|Type|Description|Note|
|-|-|-|-|
|file|FileObject|Domain 객체인 FileObject로부터 의존성을 주입받는다.|-|
|getFileFromTask|(Task): FileObject|임무객체에 해당하는 파일을 다운거나 Json으로 생성한다.|-|
|ready|(void): Promise\<void>|파일을 작업 디렉토리로 옮긴다.|-|
|finish|(void): Promise\<void>|작업 디렉토리에서 파일을 삭제한다.|-|

### TaskManager
|Arguments|Type|Description|Note|
|-|-|-|-|
|redisClient|RedisClient|도메인 객체인 redisClient로부터 의존성을 주입받는다.|-|
|fileObject|FileObject|도메인 객체인 fileObject로부터 의존성을 주입받는다.|-|
|httpResquest|HttpRequest|도메인 객체인 httpRequest로부터 의존성을 주입받는다.|-|
|tasks|Tasks|임무 객체 리스트|-|
|isTasksEmpty|(void): Promise\<boolean>|임무 객체 리스트가 비어있는지 확인.|-|
|getNewTask|(void): Promise\<Tasks>|서버로부터 임무를 조회하고 새로운 임무가 있을 경우, 임무 객체 리스트에 추가.|-|
|popTask|(void): Promise\<Task>|임무 객체 리스트로부터 임무 하나를 빼온다.|-|
|finishTask|(void): Promise\<void>|임무 객체 리스트로부터 삭제.|-|
> 서버로부터 임무 검색, 

### JobManager
|Arguments|Type|Description|Note|
|-|-|-|-|
|inputFile|FileObject|PDF파일 또는 Json파일|-|
|outputFile|FileObject|결과파일(Json파일 또는 HWP파일)|-|
|workNode|WorkNode|WorkNode객체 의존성 주입|-|
|executor|Executor|Executor객체 의존성 주입|-|
|setWorkNode|(void): Promise\<void>|워크노드에 작업을 할당.|-|
|runExe|(void): Promise\<FileObject>|exe파일 실행|-|
|checkEmpty|(void): Promise\<boolean>|워크노드가 비어있는지 확인.|-|
|clearNode|(void): void|워크노드를 비운다.|-|

### ResultManager
|Arguments|Type|Description|Note|
|-|-|-|-|
|task|Task|Task객체 의존성 주입|-|
|resultJson|JsonObject||-|
|resultFile|FileObject||-|
|httpRequest|HttpRequest||-|
|buildRequest|(void): Promise\<void>|서버에 전송할 http request 생성|-|
|reportToServer|(void): Promise\<void>|서버에 결과 전송|-|
|uploadFileToServer|(void): Promise\<void>|서버에 파일 전송|-|
> PDF: 결과 Json 전송 / HWP: 결과 Json전송 및 HWP파일 전송

### LogManager
|Arguments|Type|Description|Note|
|-|-|-|-|
|log|Log|Log객체 의존성 주입|-|
|httpRequest|HttpRequest|HttpRequest객체 의존성 주입|-|
|stack|(void): Promise\<void>|로그를 보관|-|
|stack|(void): Promise\<void>|보관한 로그 배치를 반환|-|
|stringify|(void): string|로그를 문자열로 변환|-|
|send|(void): Promise\<void>|서버로 로그를 전송|-|

## Domain
> 도메인 객체는 통상적인 Entity 타입의 객체들과 기능적인 도메인 객체로 분류하여 각각 Entity, Util로 분류.
## Entity
> Property 중심의 도메인 객체
### JsonObject
|Arguments|Type|Description|Note|
|-|-|-|-|
|data|JsonData|전용 객체|-|
|setStatus|(string): string|상태코드를 편집한다|-|
|toJson|(void): JSON|Json타입을 반환한다|-|
|toString|(void): string|string타입을 반환한다|-|

> 구현체: JsonDataInterface

### FileObject
|Arguments|Type|Description|Note|
|-|-|-|-|
|file|File|전용 객체|-|
|save|(string): string|해당 위치에 파일을 저장하고 경로를 반환.|-|
|move|(string): string|해당 위치로 파일을 옮긴다.|-|
|delete|(void): void|파일을 삭제|-|
|changeName|(string): void|파일명 변경|-|
|isExist|(void): boolean|해당하는 파일이 존재하는지 확인|-|
### Log
|Arguments|Type|Description|Note|
|-|-|-|-|
|logLevel|string|로그 레벨|-|
|status|string|상태|-|
|fileName|string|해당 작업이 실행된 파일|-|
|message|string|메시지|-|
|time|string|시간|-|
### Task
|Arguments|Type|Description|Note|
|-|-|-|-|
|id|string|임무 ID|-|
|name|string|임무명|-|
|type|string|임무 타입(PDF\|HWP)|-|
|file|string|연관 파일이 있는 경우(PDF)|-|
|data|string|json data가 있는 경우(HWP)|-|
### Tasks
|Arguments|Type|Description|Note|
|-|-|-|-|
|list|Array<Task>|임무 리스트|-|
|count|number|임무 갯수|-|
|isEmpty|(void): boolean|임무 리스트가 비었는지 확인|-|
|pop|(void): Task|임무 리스트로 부터 1개의 임무를 꺼내어 반환|-|
|add|(void): void|임무리스트에 임무 추가|-|
|remove|(void): void|임무 삭제|-|
|fetch|(Task): Array<Task>|임무 리스트에 해당 임무가 없는 경우 추가|-|
### WorkNode
|Arguments|Type|Description|Note|
|-|-|-|-|
|id|string|워크노드 ID|-|
|setWorkNode|(void): void|워크노드를 레디스에 등록|-|
|getWorkNode|(void): void|레디스에 등록된 워크노드 ID 가져오기|-|
|isOccupied|(void): boolean|워크노드가 점유중인지 확인|-|
|clearWorkNode|(void): void|워크노드 비우기|-|
|clearWorkNodeGraceFully|(Time): void|워크노드 Time객체(초\|밀리초)만큼 기다렸다 비우기|-|
## Util
> 기능 중심의 도메인 객체
### Exec
|Arguments|Type|Description|Note|
|-|-|-|-|
|file|FileObject|파일 객체로부터 의존성 주입|-|
|runPy|(void): void|파이썬 모듈 실행|-|
|runExe|(void): void|exe 타입 모듈 실행|-|

### HttpRequest
|Arguments|Type|Description|Note|
|-|-|-|-|
|http|Http|Http객체로부터 의존성 주입|-|
|response|Response|Http객체로부터 의존성 주입|-|
|request|(void): Promise\<Response>|일반적인 request|-|
|postRequest|(void): Promise\<Response>|POST request|-|
|getRequest|(void): Promise\<Response>|GET request|-|
|fileRequest|(void): Promise\<Response>|파일인 경우, 파일 form-data를 내려받는 method|
> Response 객체는 Api서버 개발 이후 변경될 수 있음
### RedisClient
|Arguments|Type|Description|Note|
|-|-|-|-|
|client|any|레디스 모듈 라이브러리의 client 객체|-|
|init|(void): Promise<void>|서버에 연결|-|
|add|(string): Promise<void>|key에 value 추가|-|
|get|(string): Promise<void>|value 가져오기|-|
|delete|(string): Promise<void>|value 삭제|-|
|deleteSlow|(number): Promise<void>|number초 뒤에 삭제|-|
|lPush|(string): Promise<void>|리스트 타입 값의 0번 인덱스에 Push|-|
|lPop|(string): Promise<void>|리스트 타입 값의 0번 인덱스에서 값 빼내오기|-|
|rPush|(string): Promise<void>|리스트 타입 값의 마지막 인덱스에 Push|-|
|rPop|(string): Promise<void>|리스트 타입 값의 마지막 인덱스에서 값 빼내오기|-|
|disconnect|(void): Promise<void>|서버 연결 종료|-|
> Redis 사용에 관한 기본적인 기능을 갖춘 Domain 객체

### Jsonify
|Arguments|Type|Description|Note|
|-|-|-|-|
|jsonData|JsonObject|JsonData 객체로부터 의존성 주입|-|
|get|(string): void|JsonData 객체에 값을 추가|-|
|eject|(void): Promise<JSON>|Json파일 생성|-|
## Common
### Constant
 |name|type|description|
 |-|-|-|
 |TaskType|enum class|HWP, PDF|

### Functions
 |name|type|description|
 |-|-|-|
 |createDirectory|(Path):void|입력한 path에 디렉토리 생성|
 |clearDirectory|(Path):void|입력한 path 폴더 비우기|
 |delay|(Time):Promise<void>|입력한 시간 오브젝트 만큼 시간을 보내는 함수|

### Interfaces
> - FileInterface
>```typescript
>name: string
>path: string
>```

>- HttpInterface
>```typescript
>url: string
>method: string
>data: any
>```

>- LogInterface
>```typescript
>logLevel: string
>status: string
>fileName: string
>message: string
>time: string
>```

>- ResponseInterface
>```typescript
>data: any
>status: number
>contentType: string
>```

>- TaskInterface
>```typescript
>id: string
>name: string
>type: TaskType
>```

>- TimeInterface
>```typescript
>second: number
>milisecond: number
>```

>- JsonDataInterface
>```typescript
>file: string
>createdBy: string
>createdAt: string
>type: TaskType
>status: string
>content: JsonDataContentInterface
>```

dependent interfaces
```typescript
interface JsonDataContentInterface {
    text: Array<JsonDataContentTextInterface>
    table: Array<JsonDataContentTableInterface>
}

interface JsonDataContentTextInterface {
    number: number
    value: string
}

interface JsonDataContentTableInterface {
    number: number
    cell: Array<JsonDataContentTableCellInterface>
}

interface JsonDataContentTableCellInterface {
    row: number
    column: number
    value: string
}
```


## Config

