package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import com.mohiva.play.silhouette.api.LoginInfo
import model.dtos.DBLoginInfo

object DBLoginInfoParser{

  val Parse: RowParser[DBLoginInfo] = {

    long("id") ~
    str("providerid") ~
    str("providerkey") map
      {
        case id ~ providerId ~ providerKey =>

         new DBLoginInfo(id ,providerId,providerKey)
      }

  }
}
