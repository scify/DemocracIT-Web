package model.repositories

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.daos.DelegableAuthInfoDAO
import com.mohiva.play.silhouette.impl.providers.OAuth2Info
import model.repositories.anorm.{OAuth2InfoParser, PasswordInfoParser}
import play.api.db.DB
import play.api.libs.concurrent.Execution.Implicits._
import model.dtos.{DBPasswordInfo, DBLoginInfo}
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
 * The DAO to store the OAuth2 information.
 *
 * Note: Not thread safe, demo only.
 */
class OAuth2InfoDAO extends DelegableAuthInfoDAO[OAuth2Info] {

  /**
   * Finds the auth info which is linked with the specified login info.
   *
   * @param loginInfo The linked login info.
   * @return The retrieved auth info or None if no auth info could be retrieved for the given login info.
   */
  def find(loginInfo: LoginInfo): Future[Option[OAuth2Info]] = {
    Future.successful(findAuth2Info(loginInfo))
  }

  /**
   * Adds new auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be added.
   * @param authInfo The auth info to add.
   * @return The added auth info.
   */
  def add(loginInfo: LoginInfo, authInfo: OAuth2Info): Future[OAuth2Info] = {
    Future.successful{
      val dblogininfo = AccountRepository.findLoginInfo(loginInfo)
      this.addAuth2Info(authInfo,dblogininfo.get.id)
    }
  }

  /**
   * Updates the auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be updated.
   * @param authInfo The auth info to update.
   * @return The updated auth info.
   */
  def update(loginInfo: LoginInfo, authInfo: OAuth2Info): Future[OAuth2Info] = {
    Future.successful{
      val dblogininfo = AccountRepository.findLoginInfo(loginInfo)
      this.updateAuth2Info(authInfo,dblogininfo.get.id)
    }
  }

  /**
   * Removes the auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be removed.
   * @return A future to wait for the process to be completed.
   */
  def remove(loginInfo: LoginInfo): Future[Unit] = {
    Future.successful{
      val dblogininfo = AccountRepository.findLoginInfo(loginInfo)
      this.removeAuth2Info(dblogininfo.get.id)
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
  def save(loginInfo: LoginInfo, authInfo: OAuth2Info): Future[OAuth2Info] = {
    find(loginInfo).flatMap {
      case Some(_) => update(loginInfo, authInfo)
      case None => add(loginInfo, authInfo)
    }
  }


  private def removeAuth2Info(loginInfoId:Long):Unit= {

    DB.withConnection { implicit c =>
      SQL"""
        DELETE FROM
          account.oauth2info
        WHERE
         logininfoid = $loginInfoId
        """.execute()
    }
  }

  private def updateAuth2Info(authInfo: OAuth2Info, loginInfoId:Long):OAuth2Info = {

    DB.withConnection { implicit c =>
      SQL"""
          UPDATE
              account.oauth2info
              SET
              accesstoken = ${authInfo.accessToken},
              tokentype = ${authInfo.tokenType},
              expiresin = ${authInfo.expiresIn},
              refreshtoken = ${authInfo.refreshToken}
              WHERE
            logininfoid = $loginInfoId
        """.execute()

      authInfo
    }


  }

  private def addAuth2Info(authInfo: OAuth2Info, loginInfoId:Long):OAuth2Info = {
    DB.withConnection { implicit c =>
      SQL"""
         INSERT INTO account.oauth2info
          (accesstoken, tokentype, expiresin, refreshtoken, logininfoid)
         VALUES
          (${authInfo.accessToken}, ${authInfo.tokenType}, ${authInfo.expiresIn}, ${authInfo.refreshToken}, $loginInfoId)
        """.execute()

      authInfo
    }
  }

  private def findAuth2Info(loginInfo:LoginInfo):Option[OAuth2Info] = {

    DB.withConnection { implicit c =>
      SQL"""
          select a.* from account.oauth2info a
            inner join account.logininfo li on a.logininfoid = li.id
          where
            li.providerid = ${loginInfo.providerID} and
            li.providerkey = ${loginInfo.providerKey}
        """.as(OAuth2InfoParser.Parse *).headOption
    }
  }
}
