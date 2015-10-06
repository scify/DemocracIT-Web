package model.repositories

import java.util.UUID
import com.mohiva.play.silhouette.api.LoginInfo
import model.User
import model.dtos.DBLoginInfo
import model.repositories.anorm._
import play.api.db.DB
import scala.collection.mutable
import scala.concurrent.Future
import play.api.Play.current
import _root_.anorm._
import _root_.anorm.SqlParser._
import play.api.db.DB

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
    SaveUser(user,1) //todo: make role_ids enum
  }
  def update(user:model.User) = Future.successful{
    updateUser(user)
  }

  private def SaveUser(user:User, roleId:Int): User ={

    var dBLoginInfo = AccountRepository.findLoginInfo(user.loginInfo) //get from database

    if (!dBLoginInfo.isDefined) {
      //login info is like facebook with user's email address, twitter with user
      dBLoginInfo = Some(this.saveLoginInfo(user.loginInfo))
    }

    this.saveUserAndUpdateLoginInfo(user,dBLoginInfo.get,roleId)
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
        """.as(UserParser.Parse  *).headOption
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
        """.as(UserParser.Parse  *).headOption
    }
  }

  private def saveLoginInfo(loginInfo:LoginInfo):DBLoginInfo = {

    DB.withConnection { implicit c =>
      val id =SQL"""
                INSERT INTO account.logininfo (providerid, providerkey)
                VALUES (${loginInfo.providerID}, ${loginInfo.providerKey})
              """.executeInsert(scalar[Long].single)

      new DBLoginInfo(id,loginInfo.providerID,loginInfo.providerKey)
    }

  }

  private def updateUser(user:model.User): model.User =
  {
    DB.withConnection() { implicit c =>
      SQL"""
               UPDATE
             account.user
           SET
             "firstName" = ${user.firstName},
             "lastName" =${user.lastName},
             "fullName" = ${user.fullName},
             "email" = ${user.email},
             "avatarurl" = ${user.avatarURL}
           WHERE
             id = ${user.userID}::uuid
            """.execute()

      user
    }
  }
  private def saveUserAndUpdateLoginInfo(user:model.User, dbloginInfo:DBLoginInfo, roleid:Int):User= {
    DB.withTransaction(){ implicit c =>

          SQL"""
                INSERT INTO account."user"
                  (id, "firstName", "lastName", "fullName", "role", email, avatarurl)
              VALUES
                  (${user.userID}::uuid , ${user.firstName}, ${user.lastName},${user.fullName}, $roleid,${user.email}, ${user.avatarURL})
              """.execute()

      //todo: insert time stamp
          SQL"""
              INSERT INTO account.userlogininfo
                   (userid, logininfoid)
               VALUES
                   (${user.userID}::uuid , ${dbloginInfo.id})
              """.execute()

      user
    }
  }
}



