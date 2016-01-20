package model.repositories.anorm

import java.util.Date

import anorm.SqlParser._
import anorm._
import model.services.TokenUser
import org.joda.time.DateTime

object TokenParser{

  val Parse: RowParser[TokenUser] = {

      get[String]("id") ~
      get[String]("email") ~
      get[Date]("expirationtime") ~
      get[Boolean]("issignup") ~
      get[String]("firstname") ~
      get[String]("lastname") map
      {
        case id ~ email ~ expirationTime ~ isSignUp ~ firstName ~ lastname =>
          TokenUser(id,email,expirationTime,isSignUp,firstName,lastname)
      }
  }
}

