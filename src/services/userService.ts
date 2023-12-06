import User from '../models/userModel'
import SearchesModel from "../models/searchModel"
import logger from '../utils/logger'

export async function getUserProfile(userId: any) {
    const user = await User.findById(userId)

    if (!user) {
        logger.error('User not found !')
        throw new Error('User not found !')
    } else {
        logger.info('User found !')
        return { id: user._id, name: user.name, email: user.email }
    }
}

export async function deleteUser(userId: string) {
    const user = await User.findById(userId)

    if (!user) {
        logger.error('User not found !')
        throw new Error('User not found !')
    } else {
        const userSearches = await SearchesModel.find({ user: userId })
        for (let i = 0; i < userSearches.length; i++) {
            await SearchesModel.deleteOne({ _id: userSearches[i]._id })
        }
        await User.deleteOne({ _id: userId })
        logger.info('User deleted !')
        return { message: 'User deleted !' }
    }
}

