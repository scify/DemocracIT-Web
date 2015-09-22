package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import com.mohiva.play.silhouette.api.LoginInfo
import model.dtos.DBLoginInfo

object UserParser{

  val Parse: RowParser[model.User] = {

      get[java.util.UUID]("id") ~
      get[Option[String]]("firstName") ~
      get[Option[String]]("lastName") ~
      get[Option[String]]("fullName") ~
      get[Option[Int]]("role") ~
      get[Option[String]]("email") ~
      get[Option[String]]("avatarUrl") ~
      get[String]("providerId") ~
      get[String]("providerKey") map
      {
        case id ~ firstName ~ lastName ~ fullName ~ role ~ email ~ avatarUrl ~ providerId ~ providerKey  =>
          new model.User(id,new LoginInfo(providerId,providerKey) ,firstName,lastName,fullName,email,avatarUrl)
      }
  }
}

