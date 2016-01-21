package model.repositories

import java.util.UUID

import _root_.anorm._
import model.dtos.User
import model.repositories.anorm._
import model.services.TokenUser
import play.api.Play.current
import play.api.db.DB


class TokenRepository {

  def findById(id:String):Option[TokenUser] = {
    DB.withConnection { implicit c =>
      SQL"""
           select * from account.token
           where id = $id
        """.as(TokenParser.Parse  *).headOption
    }
  }

  def save(token: TokenUser):TokenUser = {
    DB.withConnection { implicit c =>
       SQL"""
                          INSERT INTO account.token
                          (id,email,expirationtime,isSignUp,firstname,lastname)
                          VALUES
                          ( ${token.id}, ${token.email}, ${token.expirationTime},
                            CAST(${if (token.isSignUp) 1 else 0} AS BIT(30)),${token.firstName},${token.lastName})
            """.execute()
      token
    }

  }

  def delete(id: String)= {
    DB.withConnection { implicit c =>
      SQL"""
           DELETE FROM account.token WHERE id= $id
            """.execute()
    }
  }
}
