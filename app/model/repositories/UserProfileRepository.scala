package model.repositories

import java.util.UUID

import _root_.anorm._
import model.User
import model.repositories.anorm._
import play.api.Play.current
import play.api.db.DB

/**
  * Created by pisaris on 12/1/2016.
  */
class UserProfileRepository {

  def findUserById(userId: UUID):Option[User] = {
    DB.withConnection { implicit c =>
      //get from the login history the last recorded logininfo (facebook,email address) that was entered when user was logged in. Now retrieve the user with the login info
      SQL"""
           with ul as
           (
                 select userid,logininfoid  from account.userlogininfo ul
                   where ul.userid =  CAST($userId as UUID)
                  limit 1
           )
           select u.*,l.providerid,l.providerkey from account.user u
                  inner join ul on u.id = ul.userid
                  inner join account.logininfo l on l.id = ul.logininfoid
                  where u.id = CAST($userId as UUID)
        """.as(UserParser.Parse  *).headOption
    }
  }
}
