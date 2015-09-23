package model.repositories

import com.mohiva.play.silhouette.api.LoginInfo
import model.dtos.DBLoginInfo
import model.repositories.anorm.DBLoginInfoParser
import play.api.db.DB
import scala.collection.mutable
import scala.concurrent.Future
import play.api.Play.current
import _root_.anorm._
import _root_.anorm.SqlParser._
import play.api.db.DB


object AccountRepository
{
  def findLoginInfo(loginInfo:LoginInfo):Option[DBLoginInfo] = {
    DB.withConnection { implicit c =>

      SQL"""
           select *
            from account.logininfo
            where providerid = ${loginInfo.providerID} and
                providerkey = ${loginInfo.providerKey}
          """.as(DBLoginInfoParser.Parse  *).headOption

    }
  }
}