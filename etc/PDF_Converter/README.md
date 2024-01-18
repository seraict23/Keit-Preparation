본 프로그램은 별도 프로젝트이므로 패키지 매니저를 이용하거나 가상환경에서 실행할 것을 권장합니다.

## Poetry를 사용하는 경우

### 패키지 설치
```
poetry install
```

### 초기설정
```
// 명령어 조회
poetry run python set.py --help
// 예시
poetry run python set.py --name=filename.pdf
```

### run
```
poetry run python main.py
```

## Vanila

### 가상환경 설정
```
python -m venv .

Script/Activate.ps1
```

### 패키지 설치
```
pip install -r requirements.txt
```

### 초기설정
```
// 명령어 조회
python set.py --help
```

### 실행
```
python main.py
```
