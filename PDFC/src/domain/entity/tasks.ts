import Task from "./task";

class Tasks {
    constructor() {}

    list: Array<Task>;

    count: number;

    isEmpty() {}

    // 선입선출 (맨 앞에서 하나 뽑기)
    pop() {}

    // 선입선출 (맨 뒤에 하나 추가)
    add() {}

    // 맨 앞엣거 그냥 하나 지우기
    remove() {}

    // 리스트끼리 겹치는거 제외하고 안겹치게 합치기
    fetch() {}
}

export default Tasks;