package model.repositories

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.impl.daos.DelegableAuthInfoDAO
import com.mohiva.play.silhouette.impl.providers.{OAuth2Info, OAuth1Info}
import model.repositories.anorm.{OAuth1InfoParser, OAuth2InfoParser}
import play.api.libs.concurrent.Execution.Implicits._
import model.repositories.anorm.{OAuth2InfoParser, PasswordInfoParser}
import play.api.db.DB
import play.api.libs.concurrent.Execution.Implicits._
import model.dtos.{DBPasswordInfo, DBLoginInfo}
import model.repositories.anorm._
import play.api.Play.current
import _root_.anorm._
import _root_.anorm.SqlParser._
import play.api.db.DB
import scala.collection.mutable
import scala.concurrent.Future

/**
 * The DAO to store the OAuth1 information.
 *
 * Note: Not thread safe, demo only.
 */
class OAuth1InfoDAO extends DelegableAuthInfoDAO[OAuth1Info] {

  /**
   * Finds the auth info which is linked with the specified login info.
   *
   * @param loginInfo The linked login info.
   * @return The retrieved auth info or None if no auth info could be retrieved for the given login info.
   */
  def find(loginInfo: LoginInfo): Future[Option[OAuth1Info]] = {
    Future.successful(this.findAuth1Info(loginInfo))
  }

  /**
   * Adds new auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be added.
   * @param authInfo The auth info to add.
   * @return The added auth info.
   */
  def add(loginInfo: LoginInfo, authInfo: OAuth1Info): Future[OAuth1Info] = {

    Future.successful{
      val dblogininfo = AccountRepository.findLoginInfo(loginInfo)
      this.addAuth1Info(authInfo,dblogininfo.get.id)
    }
  }

  /**
   * Updates the auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be updated.
   * @param authInfo The auth info to update.
   * @return The updated auth info.
   */
  def update(loginInfo: LoginInfo, authInfo: OAuth1Info): Future[OAuth1Info] = {
    Future.successful {
      val dblogininfo = AccountRepository.findLoginInfo(loginInfo)
      this.updateAuth1Info(authInfo, dblogininfo.get.id)
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
      val dblogininfo = AccountRepository.findLoginInfo(loginInfo)
      this.removeAuth1Info(dblogininfo.get.id)
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
  def save(loginInfo: LoginInfo, authInfo: OAuth1Info): Future[OAuth1Info] = {
    find(loginInfo).flatMap {
      case Some(_) => update(loginInfo, authInfo)
      case None => add(loginInfo, authInfo)
    }
  }


  private def removeAuth1Info(loginInfoId:Long):Unit= {

    DB.withConnection { implicit c =>
      SQL"""
        DELETE FROM
          account.oauth1info
        WHERE
         logininfoid = $loginInfoId
        """.execute()
    }
  }

  private def updateAuth1Info(authInfo: OAuth1Info, loginInfoId:Long):OAuth1Info = {

    DB.withConnection { implicit c =>
      SQL"""
        UPDATE
          account.oauth1info
        SET
          token = ${authInfo.token},
          secret = ${authInfo.secret}
        WHERE
         logininfoid = $loginInfoId
        """.execute()

      authInfo
    }


  }

  private def addAuth1Info(authInfo: OAuth1Info, loginInfoId:Long):OAuth1Info = {
    DB.withConnection { implicit c =>
      SQL"""
        INSERT INTO account.oauth1info
            (token, secret, logininfoid)
        VALUES
            ( ${authInfo.token}, ${authInfo.secret}, $loginInfoId )
        """.execute()

      authInfo
    }
  }

  private def findAuth1Info(loginInfo:LoginInfo):Option[OAuth1Info] = {

    DB.withConnection { implicit c =>
      SQL"""
          select a.* from account.oauth1info a
            inner join account.logininfo li on a.logininfoid = li.id
          where
            li.providerid = ${loginInfo.providerID} and
            li.providerkey = ${loginInfo.providerKey}
        """.as(OAuth1InfoParser.Parse *).headOption
    }
  }


}
