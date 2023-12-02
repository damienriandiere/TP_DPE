import User from '../models/userModel';
import logger from '../utils/logger';

export async function getUserProfile(userId: any) {
    const user = await User.findById(userId);

    if (!user) {
        logger.error('User not found !')
        throw new Error('User not found !');
    }

    return {id : user._id, name: user.name, email: user.email}
}

export async function deleteUser(userId:string){
    const user = await User.findById(userId);

    if (!user) {
        logger.error('User not found !')
        throw new Error('User not found !');
    }

    const savedSearches = user.savedSearches;

    for (const search of savedSearches) {
        await search.remove();
    }

    await User.deleteOne({ _id: userId });
    logger.info('User deleted !')

    return {message: 'User deleted !'}
}

