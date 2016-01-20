package model.repositories

import java.util.UUID

import _root_.anorm._
import model.dtos.User
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

  def getTotalPointsForUser(userId:UUID):Int = {
    DB.withConnection { implicit c =>
      val result:Int = SQL"""
            select CASE WHEN sum(points)  IS NULL THEN 0 ELSE sum(points)
            END AS total_points from user_awards where user_id = CAST($userId as UUID)
            """.as(SqlParser.int("total_points").single)
      result
    }

  }

  /** Function which returns the user full name based on user id
    * @param userId user id
    */
  def getUserFullNameById(userId: UUID):String = {
    DB.withConnection { implicit c =>
      val result:String = SQL"""
            select fullname from account.user where id = CAST($userId as UUID)
            """.as(SqlParser.str("fullname").single)
      result
    }
  }
}
