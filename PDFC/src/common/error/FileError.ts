export class FileNotInitializedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileNotInitializedError"
    }
}