package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos.{DBPasswordInfo, DBLoginInfo}
import com.mohiva.play.silhouette.api.util._

object PasswordInfoParser{

  val Parse: RowParser[PasswordInfo] = {

    str("hasher") ~
    str("password") ~
    get[Option[String]]("salt") ~
    long("logininfoid")  map
      {
        case hasher ~ password~ salt ~ id =>

         new PasswordInfo(hasher,password,salt)
      }

  }
}
