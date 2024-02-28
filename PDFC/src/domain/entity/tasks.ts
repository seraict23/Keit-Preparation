import Task from "./task";

class Tasks {
    constructor() {
        this.list = []
        this.count = 0
    }

    list: Array<Task>;

    count: number;

    isEmpty() {}

    // 선입선출 (맨 앞에서 하나 뽑기)
    pop(): Task|undefined {
        if (this.count > 0) {
            this.count -= 1;
            return this.list.pop()!
        } else {
            return undefined
        }
    }

    // 선입선출 (맨 뒤에 하나 추가)
    add(task: Task): Tasks {
        this.list.push(task)
        this.count += 1
        return this
    }

    // 맨 앞엣거 그냥 하나 지우기
    remove(): void {
        if (this.count > 0) {
            this.count -= 1;
            this.list.pop()
        } 
    }

    // 리스트끼리 겹치는거 제외하고 안겹치게 합치기
    fetch(arr: Array<Task>) {
        let tempArr: Array<Task> = []
        this.list.forEach(e => tempArr.push(e))

        const merged = tempArr.concat(arr);
        const unique = merged.filter((item, pos) => merged.indexOf(item) === pos);
        this.list = unique;
    }
}

export default Tasks;