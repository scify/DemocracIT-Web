package model.dtos

import com.mohiva.play.silhouette.api.util._

//todo: this dto is specific for the repository layer. Move there
// example 1 , 'credentials' , 'alexandros.tzoumas@gmail.com'
class DBPasswordInfo  ( hasher:String,password:String,
                        salt:Option[String], loginInfoId:Long)
       extends PasswordInfo(hasher,password,salt)


