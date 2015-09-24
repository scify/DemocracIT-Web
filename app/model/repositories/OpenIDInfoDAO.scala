package model.repositories

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.impl.daos.DelegableAuthInfoDAO
import com.mohiva.play.silhouette.impl.providers.{OAuth1Info, OpenIDInfo}
import model.repositories.anorm.OAuth1InfoParser
import play.api.db.DB
import play.api.libs.concurrent.Execution.Implicits._
import model.repositories.anorm._
import _root_.anorm._
import _root_.anorm.SqlParser._
import scala.StringBuilder
import scala.collection.mutable
import scala.concurrent.Future
import play.api.Play.current

/**
 * The DAO to store the OpenID information.
 *
 * Note: Not thread safe, demo only.
 */
class OpenIDInfoDAO extends DelegableAuthInfoDAO[OpenIDInfo] {

  /**
   * Finds the auth info which is linked with the specified login info.
   *
   * @param loginInfo The linked login info.
   * @return The retrieved auth info or None if no auth info could be retrieved for the given login info.
   */
  def find(loginInfo: LoginInfo): Future[Option[OpenIDInfo]] = {
    Future.successful(finOpenIDInfo(loginInfo))
  }

  /**
   * Adds new auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be added.
   * @param authInfo The auth info to add.
   * @return The added auth info.
   */
  def add(loginInfo: LoginInfo, authInfo: OpenIDInfo): Future[OpenIDInfo] = {
    Future.successful{
      val dbLoginInfo = AccountRepository.findLoginInfo(loginInfo)
      addOpenIDInfo(authInfo,dbLoginInfo.get.id)
    }
  }

  /**
   * Updates the auth info for the given login info.
   *
   * @param loginInfo The login info for which the auth info should be updated.
   * @param authInfo The auth info to update.
   * @return The updated auth info.
   */
  def update(loginInfo: LoginInfo, authInfo: OpenIDInfo): Future[OpenIDInfo] = {
    Future.successful{
      val dbLoginInfo = AccountRepository.findLoginInfo(loginInfo)
      updateOpenIDInfo(authInfo,dbLoginInfo.get.id)
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
      val dbLoginInfo = AccountRepository.findLoginInfo(loginInfo)
      removeOpenIDInfo(dbLoginInfo.get.id)
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
  def save(loginInfo: LoginInfo, authInfo: OpenIDInfo): Future[OpenIDInfo] = {
    find(loginInfo).flatMap {
      case Some(_) => update(loginInfo, authInfo)
      case None => add(loginInfo, authInfo)
    }
  }


  private def removeOpenIDInfo(loginInfoId:Long):Unit= {

    DB.withTransaction { implicit c =>

      SQL"""
           DELETE a from
                  account.openidattributes a

           USING  account.openidinfo as i

           WHERE  a.openinfoid = i.id and
                  i.logininfoid = $loginInfoId
        """.execute()

      SQL"""
           DELETE from account.openidinfo i where i.logininfoid = $loginInfoId
        """.execute()

    }

  }

  private def updateOpenIDInfo(openIdInfo: OpenIDInfo, loginInfoId:Long):OpenIDInfo= {

   DB.withTransaction { implicit c =>

      SQL"""
           delete from account.openidattributes where openinfoid = ${openIdInfo.id}
        """.execute()

     insertIdAttributesStatement(openIdInfo.id,openIdInfo.attributes).execute()

      openIdInfo
    }
  }


  private def insertIdAttributesStatement(openIdInfoId:String, attributes: Map[String,String]) =
  {
    val values = new StringBuilder()
    attributes.foreach { x=>
      values append s"(${x._1}, ${x._2}, $openIdInfoId),"
    } //make sure that the ',' is not added in the last statement

       SQL"""
           INSERT INTO account.openidattributes ("key", value, openinfoid)
        VALUES
            ${values.substring(0, values.length-1)}
        """
  }

  private def addOpenIDInfo(openIdInfo: OpenIDInfo, loginInfoId:Long):OpenIDInfo = {
    DB.withTransaction { implicit c =>

      SQL"""
            INSERT INTO account.openidinfo
              (id, logininfoid)
            VALUES
              (${openIdInfo.id }, $loginInfoId)
        """.execute()

      insertIdAttributesStatement(openIdInfo.id,openIdInfo.attributes).execute()

      openIdInfo
    }
  }

  private def finOpenIDInfo(loginInfo:LoginInfo):Option[OpenIDInfo] = {
    DB.withConnection { implicit c =>

      val results = SQL"""
         select  a.* from account.openidinfo o
                  inner join account.logininfo l on o.logininfoid = l.id
                  left outer join account.openidattributes a on a.openinfoid = o.id
           where
            l.providerid = ${loginInfo.providerID} and
            l.providerkey = ${loginInfo.providerKey}
        """.as((str("id") ~ str("key") ~ str("value") map(flatten)) *)

       if (results.isEmpty)
        None
       else {
        val openId = results.head._1;
        val attributes= results.map { x=> (x._2,x._3) }.toMap
        new Some(OpenIDInfo(openId,attributes))
       }
    }
  }
}