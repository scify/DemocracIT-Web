package model.dtos

import com.mohiva.play.silhouette.api.LoginInfo

//todo: this dto is specific for the repository layer. Move there
// example 1 , 'credentials' , 'alexandros.tzoumas@gmail.com'
class DBLoginInfo  (var id: Long, providerId:String , providerKey: String) extends LoginInfo(providerId,providerKey)


