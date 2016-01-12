package model.repositories

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.daos.DelegableAuthInfoDAO
import model.repositories.anorm.{UserParser}
import play.api.db.DB
import play.api.libs.concurrent.Execution.Implicits._
import java.util.UUID
import com.mohiva.play.silhouette.api.LoginInfo
import model.dtos.{User, DBPasswordInfo, DBLoginInfo}
import model.repositories.anorm._
import play.api.db.DB
import scala.collection.mutable
import scala.concurrent.Future
import play.api.Play.current
import _root_.anorm._
import _root_.anorm.SqlParser._
import play.api.db.DB

import scala.collection.mutable
import scala.concurrent.Future

/**
 * The DAO to store the password information.
 */
class PasswordInfoDAO extends DelegableAuthInfoDAO[PasswordInfo] {



  /**
   * Finds the auth info which is linked with the specified login info.
   *
   * @param loginInfo The linked login info.
   * @return The retrieved auth info or None if no auth info could be retrieved for the given login info.
   */
  def find(loginInfo: LoginInfo): Future[Option[PasswordInfo]] = {
    Future.successful(findPassWordInfo(loginInfo))
  }

  /**
   * Adds new auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be added.
   * @param authInfo The auth info to add.
   * @return The added auth info.
   */
  def add(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = {
    Future.successful {
      val dbloginInfo = AccountRepository.findLoginInfo(loginInfo)
      this.savePasswordInfo(authInfo,dbloginInfo.get.id)
    }
  }

  /**
   * Updates the auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be updated.
   * @param authInfo The auth info to update.
   * @return The updated auth info.
   */
  def update(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = {
    Future.successful {
      val dbloginInfo = AccountRepository.findLoginInfo(loginInfo)
      this.updatePasswordInfo(authInfo,dbloginInfo.get.id)
    }
  }
  /**
   * Removes the auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be removed.
   * @return A future to wait for the process to be completed.
   */
  def remove(loginInfo: LoginInfo): Future[Unit] = {
    Future.successful {
      val dbloginInfo = AccountRepository.findLoginInfo(loginInfo)
      this.deletePassWordInfo(dbloginInfo.get.id)
    }
  }

  /**
   * Saves the auth info for the given login info.
   *
   * This method either adds the auth info if it doesn't exists or it updates the auth info
   * if it already exists.
   *
   * @param loginInfo The login info for which the auth info should be saved.
   * @param authInfo The auth info to save.
   * @return The saved auth info.
   */
  def save(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = {
    find(loginInfo).flatMap {
      case Some(_) => update(loginInfo, authInfo)
      case None => add(loginInfo, authInfo)
    }
  }

  private def deletePassWordInfo(id: Long): Unit =
  {
    DB.withConnection { implicit c =>
      SQL"""
                    DELETE
                      account.passwordinfo
                    WHERE
                        logininfoid = $id
            """.execute()
    }
  }

  private def updatePasswordInfo(authInfo: PasswordInfo, id: Long): PasswordInfo = {
    DB.withConnection { implicit c =>
           SQL"""
              UPDATE
                account.passwordinfo
              SET
                hasher = ${authInfo.hasher},
                "password" = ${authInfo.password},
                salt = ${authInfo.salt}
              WHERE
                  logininfoid = $id
            """.execute()

      authInfo
    }
  }

  private def savePasswordInfo(passwordInfo:PasswordInfo, loginInfoId:Long): PasswordInfo = {
    DB.withConnection { implicit c =>
      SQL"""
             INSERT INTO account.passwordinfo
              (hasher, "password", salt, logininfoid)
              VALUES
              (${passwordInfo.hasher}, ${passwordInfo.password}, ${passwordInfo.salt}, $loginInfoId)
            """.execute()

      passwordInfo
    }
  }

  private def findPassWordInfo(loginInfo:LoginInfo):Option[PasswordInfo] = {

    DB.withConnection { implicit c =>
      SQL"""
          select * from account.passwordinfo p
            inner join account.logininfo li on p.logininfoid = li.id
          where
            li.providerid = ${loginInfo.providerID} and
            li.providerkey = ${loginInfo.providerKey}
        """.as(PasswordInfoParser.Parse *).headOption
    }
  }
}
