package model.repositories

import java.util.UUID
import com.mohiva.play.silhouette.api.LoginInfo
import model.User
import model.dtos.DBLoginInfo

import model.repositories.anorm._
import play.api.db.DB
import scala.collection.mutable
import scala.concurrent.Future

/**
 * Give access to the user object.
 */
class UserDAOImpl extends UserDAO {

  /**
   * Finds a user by its login info.
   *
   * @param loginInfo The login info of the user to find.
   * @return The found user or None if no user for the given login info could be found.
   */
  def find(loginInfo: LoginInfo)= Future.successful {
    findUserByLoginInfo(loginInfo)
  }

  /**
   * Finds a user by its user ID.
   *
   * @param userID The ID of the user to find.
   * @return The found user or None if no user for the given ID could be found.
   */
  def find(userID: UUID) = Future.successful{
    findUserById(userID)
  }

  /**
   * Saves a user.
   *
   * @param user The user to save.
   * @return The saved user.
   */
  def save(user: model.User) = Future.successful{
    SaveUser(user)
  }

  private def SaveUser(user:User): User ={

    val dBLoginInfo = this.findUserLoginInfo(user.loginInfo) //get from database

    if (dBLoginInfo.isDefined) //login info is like facebook with user's email address, twitter with user
      {
        //we have the id
      }
    else
      {
        //save login info and get id
      }

    //now we can use the login info

    //do these two transactionally

    //save or update user
    // insert db user login info row //todo: add a date stamp there

  }

  private def findUserById(userId: UUID):Option[User] = {
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
        """.as(UserParser.Parse  *)
    }
  }

  private def findUserByLoginInfo(loginInfo:LoginInfo):Option[User] = {
    DB.withConnection { implicit c =>
      SQL"""
        select u.*,l.providerid,l.providerkey
        from account.user u
          inner join account.userlogininfo ul on ul.userid = u.id
          inner join account.logininfo l on l.id = ul.logininfoid
        where
            providerid = ${loginInfo.providerID} and
            providerkey = ${loginInfo.providerKey}
        """.as(UserParser.Parse  *)
    }
  }

    private def findLoginInfo(loginInfo:LoginInfo):Option[DBLoginInfo] = {
      DB.withConnection { implicit c =>

        SQL"""
           select *
            from account.logininfo
            where providerid = ${loginInfo.providerID} and
                providerkey = ${loginInfo.providerKey}
          """.as(DBLoginInfoParser.Parse  *)

      }
    }
}

