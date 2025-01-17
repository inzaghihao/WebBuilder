import Response from '../../../../database/Response.js'
export default class _Error {
    constructor() {}
    #getModel() {
        return {
            ip: null,
            message: '',
        }
    }

    @Response('添加日志成功')
    async addError(request, response, Cabin) {
        let model = this.#getModel()
        model.ip = request.ip
        model.message = request.body.message
        await Cabin.Error.create(model)
    }

    @Response()
    async getErrorList(request, response, Cabin) {
        let list = await Cabin.Error.query({})
        list = list.reverse().slice(0, 50)
        return list
    }
}
