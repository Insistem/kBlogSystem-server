// 连接数据库,获取用户数据
// 建立用户模型
module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    const UserSchema = new Schema({
        email: { type: String, required: true},
        password: { type: String, required: true},
        nickname: { type: String, required: true},
        avatar: { type: String, required: false, default: '/user.png'},
    }, {timestamps: true}) // 这里配置timestamps,会自动在每行数据中增加 createDate 和 updateDate字段
    return mongoose.model('User', UserSchema)
}