package model.repositories.anorm


import anorm.SqlParser._
import anorm._
import com.mohiva.play.silhouette.impl.providers.{OAuth1Info, OAuth2Info}
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


object OAuth1InfoParser {
  val Parse: RowParser[OAuth1Info] = {

      long("id") ~
      str("token") ~
      str("secret") ~
      long("logininfoid")   map
      {
        case id ~ token ~ secret ~ logininfoid =>
          OAuth1Info(token,secret)
      }
  }
}
