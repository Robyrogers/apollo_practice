import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export default {
    Query: {
        user: async (parent, { id }, { models: { userModel }, me }, info) => {
            if(!me) {
                throw new AuthenticationError('You are not Authenticated')
            }
            const user = await userModel.findById({ _id: id }).exec()
            return user
        },
        login: async (parent, { name, password }, { models: { userModel }, me }, info) => {
            const user = await userModel.findOne({ name }).exec()

            if(!user) {
                return new AuthenticationError('No User found!')
            }

            const matchPasswords = bcrypt.compareSync(password, user.password)

            if(!matchPasswords) {
                throw new AuthenticationError("Password didn't match!")
            }

            const token = jwt.sign({ id: user.id }, 'riddlemethis', { expiresIn: 24 * 10 * 50 })

            return {
                token
            }
        }
    },
    Mutation: {
        createdUser: async (parent, { name, password }, { models: { userModel } }, info) => {
            const user = await userModel.create({ name, password })
            return user
        }
    },
    User: {
        posts: async ({ id }, args, { models: { postModel } }, info) => {
            const posts = await postModel.find({ author: id }).exec()
            return posts
        }
    }
}