const { createFolder } = require('../db/models/favorites.model')
const Favorites = require('../db/models/favorites.model')
const GS = require('./GalleryService')
const GalleryService = new GS()
module.exports =  {
    async getUserFavorites(user_id){
        try {
            console.log(user_id)
            let favorites = await Favorites.getUnsortedFavorites(user_id)
            let galleries = await Promise.all(favorites.map(async (gallery)=>{
                return await GalleryService.create_safe_dispatch_async(gallery)
            }))
            return galleries
        } catch (err) {
            console.log(err)
            throw new Error('YUCK!')
        }
    },
    async createFolder(user_id){
        try {
            let folder_db_response = await Favorites.createFolder(user_id, "New Folder")
            return folder_db_response

        } catch (err) {
            return 500
        }
    },
    async getFolders(user_id){
        try {
            let folders_response = await Favorites.getFolders(user_id)
            return folders_response
        } catch (err) {
            return 500
            
        }
    },
    async renameFolder(user_id, folder_id, newName){
        try {
            let rename_response = await Favorites.renameFolder(user_id, folder_id, newName)
            return rename_response
        } catch (err) {
            return 500
        }
    },
    async getFolder(user_id, folder_id){
        try {
            let folder_response = await Favorites.getFolder(user_id, folder_id)
            let galleries = await Promise.all(folder_response.map(async (gallery)=>{
                return await GalleryService.create_safe_dispatch_async(gallery)
            }))
            return galleries
        } catch (err) {
            return folder_response
        }   
    },
    async moveFavorite(user_id, gallery_id, folder_id){
        try {
            let move_db_response = await Favorites.move(user_id, gallery_id, folder_id)
            return move_db_response
        } catch (err) {
            return 401
        }
    }
}