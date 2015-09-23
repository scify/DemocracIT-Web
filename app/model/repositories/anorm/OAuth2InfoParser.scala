package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import com.mohiva.play.silhouette.impl.providers.OAuth2Info
import model.dtos._
import model.dtos.{DBPasswordInfo, DBLoginInfo}
import model.repositories.anorm._
import play.api.db.DB
import scala.collection.mutable
import scala.concurrent.Future
import play.api.Play.current
import _root_.anorm._
import _root_.anorm.SqlParser._
import play.api.db.DB

/**
 * Created by pisaris on 9/7/2015.
 */
object OAuth2InfoParser {
  val Parse: RowParser[OAuth2Info] = {

      long("id") ~
      str("accesstoken") ~
      get[Option[String]]("tokentype") ~
      get[Option[Int]]("expiresin") ~
      get[Option[String]]("refreshtoken") ~
      long("logininfoid")   map
      {
        case id ~ accesstoken ~ tokentype ~ expiredin ~ refreshtoken ~ logininfoid =>
          OAuth2Info(accesstoken,tokentype,expiredin,refreshtoken)
      }
  }
}
